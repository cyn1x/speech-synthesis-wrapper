import { GoogleIncoming, VoiceTypes } from './types'
import LanguageTags from './config'

const Alphabet = () => {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

  return alphabet
}

export const UnpackageGoogleVoices = async(fetchedVoices: any) => {
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
    const genderAndType = DetermineGoogleGender(voiceType.name)
    voice.standard.push(genderAndType)

    return
  }
  
  const genderAndType = DetermineGoogleGender(voiceType.name)
  voice.neural.push(genderAndType)
}

const DetermineGoogleGender = (voiceName: string) => {
  const alphabet = Alphabet()

  let genderAndType = ""

  // The format of e.g. en-AU-WaveNet-A for voice types has been deemed to be unacceptable for user friendliness
  // Google TTS API seems to have odd indexed alphabet letters as female and even as male
  alphabet.forEach(letter => {
    if (voiceName.endsWith(letter)) {
      const isEven = (alphabet.indexOf(letter) + 1) % 2 === 0

      if (isEven) {
        genderAndType = "Male-" + letter

        return
      }

        genderAndType = "Female-" + letter

        return
    }
  })

  return genderAndType
}

export const PackageGoogleVoices = (data: { [k: string]: FormDataEntryValue }) => {
  const languageTag = data.voiceLanguage.toString()
  const languageCode = PackageGoogleHelper(languageTag)
  const name = DetermineVoiceType(languageCode, data.voiceType.toString(), data.voiceStyle.toString())
  
  const GoogleData = {
    audioConfig: {
      audioEncoding: "LINEAR16",
      pitch: 0.00,
      speakingRate: 1.00
    },
    input: {
      text: data.textToSpeak
    },
    voice: {
      "languageCode": languageCode,
      "name": name
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

    return null
  })

  return languageCode
}

const DetermineVoiceType = (tag: string, type: string, test: string) => {
  let voiceType = ""

  if (type === 'Neural') {
    voiceType = "WaveNet"
  }
  else {
    voiceType = "Standard"
  }
  
  return tag + "-" + voiceType + "-" + test.slice(-1)
}
