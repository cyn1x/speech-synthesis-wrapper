import { GoogleIncoming, VoiceTypes } from './types'
import LanguageTags from './config'

const Services = () => {
  const services = {
    google: "Google"
  }

  return services
}

export const GetVoices = async (platform: string) => {
  const services = Services()

  switch (platform) {
    case services.google:
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

export const PostVoices = async (platform: string, data: { [k: string]: FormDataEntryValue }) => {
  const services = Services()

  switch (platform) {
    case services.google:
      const body = PackageGoogleVoices(data)
      return await HandlePost(body)
    // Not currently supporting other text-to-speech services
  }

}

const PackageGoogleVoices = (data: { [k: string]: FormDataEntryValue }) => {
  const languageCode = PackageGoogleHelper(data.voiceLanguage as string)
  
  const GoogleData = {
    audioConfig: {
      audioEncoding: "LINEAR16",
      pitch: 0,
      speakingRate: 1
    },
    input: {
      text: data.textToSpeak
    },
    voice: {
      "languageCode": languageCode,
      "name": data.voiceStyle
    }
  }

  const jso = JSON.stringify(GoogleData)

  return jso
}

const PackageGoogleHelper = (language: string) => {
  const languageTags: Map<string, string> = LanguageTags()
  let languageCode = ""
  
  Array.from( languageTags ).map(([ key, value ], id) => {
    if (language === value) {
      languageCode = key
    }
  })

  return languageCode
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
