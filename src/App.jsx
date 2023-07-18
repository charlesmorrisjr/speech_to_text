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

async function fromFile() {
    // let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync("../whatstheweatherlike.wav"));
    let audioConfig  = sdk.AudioConfig.fromDefaultMicrophoneInput();
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    speechRecognizer.recognizeOnceAsync(result => {
        switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                console.log(`RECOGNIZED: Text=${result.text}`);
                output = result.text;
                // return result.text;
                break;
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

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
  
  let currentValue = output;
  
  function handleButtonClick() {
    // Update the textbox value when the button is clicked
    fromFile();
    console.log(output);
    // setTranscription(output);
    // let text='abc';
  }
  
  setInterval(() => {
    if (output !== currentValue) {
      console.log('Variable modified:', output);
      setTranscription(output);
      currentValue = output;
    }
  }, 500);
  
  return (
    <>
      <p>{transcription}</p>
      <input type='textbox' value='' />
      <button onClick={handleButtonClick}>Click</button>
    </>
  )
}
