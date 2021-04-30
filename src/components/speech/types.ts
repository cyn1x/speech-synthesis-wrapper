import { Dispatch, SetStateAction } from "react";

export interface PlatformService {
  platform: string
  setPlatform: Dispatch<SetStateAction<string>>
}

export interface GoogleIncoming {
  language_codes: string[]
  name: string
  ssml_gender: number
  natural_sample_rate_hertz: number
}

export interface VoiceTypes {
  standard: string[]
  neural: string[]
}

export interface GoogleOutgoing {
  audioConfig: GoogleAudioConfig
  input: GoogleInput
  voice: GoogleVoice
}

interface GoogleAudioConfig {
  audioEncoding: string
  pitch: number
  speakingRate: number
}

interface GoogleInput {
  text: string
}

interface GoogleVoice {
  languageCode: string
  name: string
}
