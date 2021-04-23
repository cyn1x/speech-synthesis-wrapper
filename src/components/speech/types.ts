import React, { Dispatch, SetStateAction } from "react";

export interface SpeechProps {
    audio: AudioProps
    setAudio: Dispatch<SetStateAction<AudioProps>>
}

export interface AudioProps {
    synthesisData: string
    isPlaying?: boolean
}

export interface SubmissionProps {
    audioData: SpeechProps
    clickHandler: React.MouseEvent
}
