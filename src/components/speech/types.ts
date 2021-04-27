export interface GoogleData {
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
