import { GoogleIncoming, VoiceTypes } from './types'
import LanguageTags from './config'

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
}
const google = "Google"

export const GetVoices = async (platform: string) => {
  switch (platform) {
    case google:
      return ApplyGoogleVoices()
    // Not currently supporting other text-to-speech services
  }

}

const ApplyGoogleVoices = async() => {
  const fetchedVoices = await HandleGet()
  const incoming: Array<GoogleIncoming> = fetchedVoices.voices
  const languageTags: Map<string, string> = LanguageTags()

  let languageMap: Map<string, VoiceTypes> = new Map()

  incoming.forEach((element) => {
    const lang = languageTags.get(element.language_codes[0])
    
    if (lang !== undefined) {
      const cachedLang = languageMap.get(lang)
      
      if (cachedLang !== undefined) {
        AddGoogleVoice(element, cachedLang)

      } else {
        const uncachedLang: VoiceTypes = {
          standard: [],
          neural: []
        }
  
        AddGoogleVoice(element, uncachedLang)

        languageMap.set(lang, uncachedLang)
      }

    }

  })

  return languageMap
}

const AddGoogleVoice = (voiceType: GoogleIncoming, voice: VoiceTypes) => {
  if (voiceType.name.includes('Standard')) {
    voice.standard.push(voiceType.name)

    return
  }
  
  voice.neural.push(voiceType.name)
}

export const PostVoices = async (platform: string) => {
  switch (platform) {
    case google:
      const body = JSON.stringify(GoogleData)
      return await HandlePost(body)
    // Not currently supporting other text-to-speech services
  }

}

const HandleGet = async () => {
  const res = await Fetch('GET', null)
  const jso = await res.json()

  return jso
}

const HandlePost = async (body: string) => {
  const res = await Fetch('POST', body)
  const jso = await res.json()

  return jso
}

const Fetch = async (requestMethod: string, bodyContents: string | null) => {
  const response = await fetch('http://localhost:8080/api/google', {
    method: requestMethod,
    headers: {
      'Content-Type': 'application/json'
    },
    body: bodyContents
  })

  return response
}
