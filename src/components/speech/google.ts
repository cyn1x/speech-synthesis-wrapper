import { GoogleIncoming, GoogleOutgoing, VoiceTypeData, VoiceTypeNames, VoiceTypes } from './types'
import LanguageTags from './config'
import { GenericVoiceTypes } from './handler'

enum Genders {
  ssml_gender_voice_unspecified = 0,
  ssml_gender_male = 1,
  ssml_gender_female = 2,
  ssml_gender_neutral = 3
}

const GooleVoiceTypes = () => {
  const GoogleVoiceTypes: VoiceTypeNames = {
    neural: "WaveNet",
    standard: "Standard"
  }

  return GoogleVoiceTypes
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
  const genderAndType = DetermineGender(voiceType.ssml_gender, voiceType.name)

  if (voiceType.name.includes(GenericVoiceTypes().standard)) {
    voice.standard.push(genderAndType)

    return
  }

  voice.neural.push(genderAndType)
}

const DetermineGender = (genderCode: number, voiceName: string) => {
    const alphabetLetter = voiceName.slice(-1)

    switch(genderCode) {
      case Genders.ssml_gender_male:
        return "Voice-" + alphabetLetter + "-Male"
      case Genders.ssml_gender_female:
        return "Voice-" + alphabetLetter + "-Female"
      case Genders.ssml_gender_neutral:
        return "Voice-" + alphabetLetter + "-Neutral"
      default:
        return "Voice-" + alphabetLetter + "-Unspecified"
    }

}

export const PackageGoogleVoices = (data: { [k: string]: FormDataEntryValue }) => {
  const languageCode = PackageHelper(data.voiceLanguage.toString())
  const voiceTypeData = VoiceTypePacker(data, languageCode)
  const name = DetermineVoiceType(voiceTypeData)
  
  const GoogleData: GoogleOutgoing = {
    audioConfig: {
      audioEncoding: "LINEAR16",
      pitch: 0.00,
      speakingRate: 1.00
    },
    input: {
      text: data.textToSpeak.toString()
    },
    voice: {
      "languageCode": languageCode,
      "name": name
    }
  }

  const jso = JSON.stringify(GoogleData)

  return jso
}

const VoiceTypePacker = (data: { [k: string]: FormDataEntryValue }, languageCode: string): VoiceTypeData => {
  const voiceTypeData: VoiceTypeData = {
    languageTag: languageCode,
    voiceType: data.voiceType.toString(),
    voiceName: data.voiceStyle.toString()
  }

  return voiceTypeData
}

const PackageHelper = (language: string) => {
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

const DetermineVoiceType = (voiceTypeData: VoiceTypeData) => {
  const letter = voiceTypeData.voiceName.split("-")[1]
  const voiceType = GooleVoiceTypes()
  const type = (voiceTypeData.voiceType === GenericVoiceTypes().neural ? voiceType.neural : voiceType.standard)

  return voiceTypeData.languageTag + "-" + type + "-" + letter
}
