import React, { useState, useEffect } from 'react';
import './App.css';
import generateRhyme from './rhymeGenerator'; // Import the function

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function App() {
    const [isListening, setIsListening] = useState(false);
    const [note, setNote] = useState(null);
    const [savedNotes, setSavedNotes] = useState([]);

    useEffect(() => {
        handleListen();
    }, [isListening]);

    const handleListen = () => {
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
        const generatedText = await generateRhyme(note); // Use the imported function
        if (generatedText !== null) {
            formatRhyme(generatedText);
            setNote('');
        }
    };

    function formatRhyme(inputString) {
        const lines = inputString.split(/\d+\./);
        const cleanedLines = lines.map((line) => line.trim()).filter((line) => line);

        if (cleanedLines.length >= 3) {
            const [row1, row2, row3] = cleanedLines;
            setSavedNotes([...savedNotes, row1, row2, row3]);
        } else {
            console.error("Input string does not have enough lines.");
        }
    }

    return (
        <>
            <h1>Voice Notes</h1>
            <div className="container">
                <div className="box">
                    <h2>Current Note</h2>
                    {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
                    <button onClick={handleGenerateRhyme} disabled={!note}>
                        Save Note
                    </button>
                    <button onClick={() => setIsListening((prevState) => !prevState)}>
                        Start/Stop
                    </button>
                    <p>{note}</p>
                </div>
                <div className="box">
                    <h2>Notes</h2>
                    {savedNotes.map((n, index) => (
                        <p key={index}>{n}</p>
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;
