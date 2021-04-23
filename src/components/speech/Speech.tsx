import React, { useEffect, useState } from 'react';
import { AudioProps, SpeechProps } from './types'
import Form from './Form'

const DefaultAudioProps = () => {
    const DefaultVoiceProps: AudioProps = {
        synthesisData: "",
        isPlaying: false
    }

    return DefaultVoiceProps
}

const Container = () => {
    const [data, setData] = useState<AudioProps>(DefaultAudioProps)
    
    return (
        <Form
            audio={data}
            setAudio={setData}
        />
    )
}

export default Container
