import { useState, useEffect } from 'react'
import './App.css'
// import { fromFile } from '../SpeechRecognition';
// import { fromFile } from '../test';
// const speechConfig = sdk.SpeechConfig.fromSubscription(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);

import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);
speechConfig.speechRecognitionLanguage = "en-US";

// disable telemetry data
sdk.Recognizer.enableTelemetry(false);

let output = '';
let currentValue = '';
let changeValue = true;

function fromFile() {
    let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    speechRecognizer.recognizeOnceAsync(result => {
        switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                console.log(`RECOGNIZED: Text=${result.text}`);
                output = result.text;
                changeValue = true;
                // return result.text;
                break;
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                output = 'NOMATCH';
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);
                output = 'CANCELED';

                if (cancellation.reason == sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                }
                break;
        }
        speechRecognizer.close();
    });
}

export default function App() {
  const [transcription, setTranscription] = useState('');
  
  function handleButtonClick() {
    // Update the textbox value when the button is clicked
    fromFile();
    console.log(output);
    setTranscription('output');
    // let text='abc';
  }

  useEffect(() => {
    const timeoutID = setInterval(() => {
      // if (output !== currentValue && output !== '' && output !== 'NOMATCH' && output !== 'CANCELED') {
      if (changeValue) {
        if (output === 'Goodbye.') alert('Goodbye!');
        currentValue = output;
        changeValue = false;
        console.log('Variable modified:', output);
        setTranscription(output);
        fromFile();
      } else if (output === 'NOMATCH') {
        output = '';
        fromFile();
        // currentValue = '';
        // fromFile();
        console.log('restart');
      }
    }, 100);
    
    return () => clearInterval(timeoutID);
  }, []);
  // setInterval(() => {
  //   if (changeValue) {
  //     changeValue = false;
  //     console.log('Variable modified:', output);
  //     setTranscription(output);
  //   }
  // }, 500);
  
  return (
    <>
      <p>{transcription}</p>
      <input type='textbox' />
      <button onClick={handleButtonClick}>Click</button>
    </>
  )
}
