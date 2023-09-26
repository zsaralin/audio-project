import React, { useState, useEffect, useRef } from 'react';
import {Button, Icon} from "semantic-ui-react";
import * as backendFn from "./rhymeGenerator";
import {generateText} from "./rhymeGenerator";

const AudioRecorder = ({ isRecording, setIsRecording }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const audioPlayerRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(null);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices[7];

    useEffect(() => {
        const initializeMediaRecorder = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
                    }
                };

                recorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
                    audioPlayerRef.current.src = URL.createObjectURL(audioBlob);
                    await backendFn.generateText(audioBlob);
                };

                setMediaRecorder(recorder);
            } catch (error) {
                console.error('Error accessing the microphone:', error);
            }
        };

        initializeMediaRecorder();
    }, []); // Initialize only once

    useEffect(() => {
        if (isRecording) {
            if (mediaRecorder) {
                mediaRecorder.start();
            }
        } else {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        }
    }, [isRecording, mediaRecorder]);

    // Handle audioChunks updates to create the audio blob when recording is stopped
    useEffect(() => {
        if (!isRecording && audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioPlayerRef.current.src = URL.createObjectURL(audioBlob);
        }
    }, [audioChunks, isRecording]);
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
    return (
        <div>
            <button className="button-85" onClick={() => setIsRecording(!isRecording)}
                    style={{
                        backgroundColor: isRecording ? '#6C63E0' : '',
                        minWidth: '170px'
                    }}>
                {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            <Button icon basic style={{border: 'none', boxShadow: 'none', marginLeft: '-10px'}}
                    onClick={() => speakNote()}
            >
                <Icon name="volume down"/>
            </Button>
            <audio style = {{display : 'none'}} ref={audioPlayerRef} controls />
        </div>
    );
};

export default AudioRecorder;
