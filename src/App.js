import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import * as backendFn from './rhymeGenerator'; // Import the function
import {Button, Icon} from 'semantic-ui-react';
import AudioRecorder from './AudioRecorder'; // Import the AudioRecorder component

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';


function App() {
    const [isListening, setIsListening] = useState(false);
    const [note, setNote] = useState(null);
    const [rhyme, setRhyme] = useState([]);
    const [poem, setPoem] = useState([]);
    const [haiku, setHaiku] = useState([]);
    const [song, setSong] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(null);
    const [uploadedFileName, setUploadedFileName] = React.useState(null);
    const [showUploadButton, setShowUploadButton] = useState(false);
    const {SpeechSynthesisUtterance} = window;
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices[7];



    useEffect(() => {
        handleListen();
    }, [isListening]);
    useEffect(() => {
        // Parse the query string
        const params = new URLSearchParams(window.location.search);
        const whisperParam = params.get('whisper');

        // Check if the 'whisper' parameter exists and is set to 'true'
        if (whisperParam === 'true') {
            setShowUploadButton(true);
        }
    }, []);
    const handleListen = async () => {
        if (isListening) {
            mic.start();
            mic.onend = () => {
                mic.start();
            };
        } else {
            mic.stop();
            mic.onend = () => {
                console.log('Stopped Mic on Click');
            };
        }
        mic.onstart = () => {
            console.log('Mics on');
        };

        mic.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('');
            setNote(transcript);
            mic.onerror = (event) => {
                console.log(event.error);
            };
        };
    };

    const handleGenerateRhyme = async () => {
        setRhyme([]);
        const generatedText = await backendFn.generateRhyme(note); // Use the imported function
        console.log(generatedText)
        if (generatedText !== null) {
            setRhyme([generatedText]);
        } else {
            console.error("Input string does not have enough lines.");
        }
    };

    const handleGeneratePoem = async () => {
        setPoem([]);
        const generatedText = await backendFn.generatePoem(note); // Use the imported function
        if (generatedText !== null) {
            // Replace escaped "\\n" with actual line breaks "\n"
            const formattedText = generatedText.replace(/\\n/g, '\n');

            // Split the formatted text into an array of lines
            const lines = formattedText.split('\n');

            // Map the lines to JSX elements with line breaks
            const poemElements = lines.map((line, index) => (
                <a key={index}>{line}</a>
            ));

            setPoem(poemElements);
        } else {
            console.error("Input string does not have enough lines.");
        }
    };

    const handleGenerateHaiku = async () => {
        setHaiku([]);
        const generatedText = await backendFn.generateHaiku(note); // Use the imported function
        if (generatedText !== null) {
            const formattedText = generatedText.replace(/\\n/g, '\n');
            const lines = formattedText.split('\n');
            const haikuElements = lines.map((line, index) => (
                <a key={index}>{line}</a>
            ));
            setHaiku(haikuElements);
        } else {
            console.error("Input string does not have enough lines.");
        }
    };

    const handleGenerateSong = async () => {
        setSong([]);
        const generatedText = await backendFn.generateSong(note); // Use the imported function
        if (generatedText !== null) {
            // Replace escaped "\\n" with actual line breaks "\n"
            const formattedText = generatedText.replace(/\\n/g, '\n');

            // Split the formatted text into an array of lines
            const lines = formattedText.split('\n');

            // Map the lines to JSX elements with line breaks
            const songElements = lines.map((line, index) => (
                <a key={index}>{line}</a>
            ));

            setSong(songElements);
        } else {
            console.error("Input string does not have enough lines.");
        }
    };

    const speakNote = (note2) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false)
            return
        }
        window.speechSynthesis.cancel();
        if ('speechSynthesis' in window && note2 !== null) {
            setIsSpeaking(true)
            const utterance = new window.SpeechSynthesisUtterance(note2); // Speak the current note
            utterance.voice = selectedVoice;
            utterance.onend = () => {
                setIsSpeaking(false); // Set isSpeaking to false when speech is done
            };
            window.speechSynthesis.speak(utterance);
        } else {
            console.log('Speech synthesis not supported in this browser.');
        }
    };
    const speakNote2 = (note2) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false)
            return
        }
        setIsSpeaking(true)
        window.speechSynthesis.cancel();
        if ('speechSynthesis' in window && note2 !== null) {
            note2.forEach((paragraph, index) => {
                if (paragraph.props.children) {
                    const lines = paragraph.props.children.split('\n'); // Split the content into lines

                    lines.forEach((line, lineIndex) => {
                        const utterance = new window.SpeechSynthesisUtterance(line);
                        utterance.voice = selectedVoice;

                        if (!(index === note2.length - 1 && lineIndex === lines.length - 1)) {
                            utterance.onend = () => {
                                if (lineIndex === lines.length - 1) {
                                    setIsSpeaking(false); // Set isSpeaking to false when speech is done
                                }
                            };
                        }
                        window.speechSynthesis.speak(utterance);
                    });
                }
            });
        } else {
            console.log('Speech synthesis not supported in this browser.');
        }
    };

    const fileInputRef = useRef(null); // Define the file input ref

    // Define the function to handle audio file upload
    const handleAudioUpload = (event) => {
        const selectedFile = event.target.files[0];
        setUploadedFileName(selectedFile.name);
        // You can now process the selected audio file here
    };
    const [isRecording, setIsRecording] = useState(false); // State to control recording

    return (
        <>
            <h1></h1>
            <div className="container">
                <div className="box">
                        <div>
                            <button
                                className="button-85"
                                style={{
                                    backgroundColor: isListening ? '#6C63E0' : '',
                                    minWidth: '170px'
                                }}
                                onClick={() => {
                                    setIsListening((prevState) => !prevState); // Toggle listening state
                                }}
                            >
                                {isListening ? 'Recording...' : 'Start Recording'}
                            </button>
                            <Button icon basic style={{border: 'none', boxShadow: 'none', marginLeft: '-10px'}}
                                    onClick={() => speakNote(note)}
                            >
                                <Icon name="volume down"/>
                            </Button>
                            <p style={{marginLeft: '20px', marginTop: '15px'}}>{note}</p>
            </div>
                </div>
            </div>

            <div className="bottom-section">
                <div className="column">
                    <div className="box-small">
                        <button className="button-85" onClick={handleGenerateRhyme} disabled={!note}>
                            Rhyme
                        </button>
                        <Button icon basic style={{border: 'none', boxShadow: 'none', marginLeft: '-10px'}}
                                onClick={() => speakNote(rhyme)}>
                            <Icon name="volume down"/>
                        </Button>
                        {rhyme.map((n, index) => (
                            <p style={{marginTop: '15px'}} key={index}>{n}</p>
                        ))}
                    </div>
                </div>
                <div className="column">
                    <div className="box-small">
                        <button className="button-85" onClick={handleGeneratePoem}>
                            Poem
                        </button>
                        <Button icon basic style={{border: 'none', boxShadow: 'none', marginLeft: '-10px'}}
                                onClick={() => speakNote2(poem)}>
                            <Icon name="volume down"/>
                        </Button>
                        {poem.map((n, index) => (
                            <p key={index}>{n}</p>
                        ))}
                    </div>
                </div>
                <div className="column">
                    <div className="box-small">
                        <button className="button-85" onClick={handleGenerateHaiku} disabled={!note}>
                            Haiku
                        </button>
                        <Button icon basic style={{border: 'none', boxShadow: 'none', marginLeft: '-10px'}}
                                onClick={() => speakNote2(haiku)}>
                            <Icon name="volume down"/>
                        </Button>
                        {haiku.map((n, index) => (
                            <p key={index}>{n}</p>
                        ))}
                    </div>
                </div>
                <div className="column">
                    <div className="box-small">
                        <button className="button-85" onClick={handleGenerateSong} disabled={!note}>
                            Song
                        </button>
                        <Button icon basic style={{border: 'none', boxShadow: 'none', marginLeft: '-10px'}}
                                onClick={() => speakNote2(song)}>
                            <Icon name="volume down"/>
                        </Button>
                        {song.map((n, index) => (
                            <p key={index}>{n}</p>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
