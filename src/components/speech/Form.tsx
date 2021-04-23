import React, { useEffect, useState } from 'react';
import { AudioProps, SpeechProps, SubmissionProps } from './types';

const GoogleData = {
    audioConfig: {
        audioEncoding: "LINEAR16",
        pitch: 0,
        speakingRate: 1
    },
    input: {
        text: "Hello, World!"
    },
    voice: {
        "languageCode": "en-US",
        "name": "en-US-Wavenet-G"
    }
};

const Form = (props: SpeechProps) => {
    return (
        <>
            <SubmitButton
                audio={props.audio}
                setAudio={props.setAudio}
            />
        </>
    );
}

const SubmitButton = (props: SpeechProps) => {
    return (
        <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            const submission: SubmissionProps = {
                audioData: props,
                clickHandler: event
            }

            HandleSubmit(submission)
        }}>
            Speak it!
        </button>
    )
}

const HandleSubmit = async (props: SubmissionProps) => {
    const voiceData = Package(await Fetch())
    
    props.audioData.setAudio(await voiceData)
    PlayVoice((await voiceData).synthesisData)
}

const Fetch = async () => {
    const response = await fetch('http://localhost:8080/api/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(GoogleData)
    })

    return response
}

const Package = async (res: Response) => {
    const DefaultVoiceProps: AudioProps = {
        synthesisData: await res.json(),
        isPlaying: false
    }

    return DefaultVoiceProps
}

const PlayVoice = (props: string) => {
    const speech = new Audio("data:audio/wav;base64," + props)

    speech.play()
}

export default Form
