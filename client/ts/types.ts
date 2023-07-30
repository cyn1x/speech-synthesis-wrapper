export interface RequestMethod {
  uri: string,
  method: string,
  body: string | null
}

interface LanguageState { 
  lang: string,
  type: string,
}

export interface FormStateData {
  // voiceList: Map<string, VoiceTypes>,
  voiceList: Map<string, any>,
  voiceTypes: string[],
  voiceLang: string
}

export interface VoiceTypeData {
  languageTag: string,
  voiceType: string,
  voiceName: string
}

export interface GoogleIncoming {
  language_codes: string[]
  name: string
  ssml_gender: number
  natural_sample_rate_hertz: number
}

// export interface VoiceTypes {
//   standard: string[]
//   neural: string[]
// }

export interface VoiceTypeNames {
  neural: string
  standard: string
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
