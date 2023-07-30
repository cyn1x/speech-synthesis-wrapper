import LanguageTags from './config.js';
// import { GenericVoiceTypes } from './handler.js'
var Genders;
(function (Genders) {
    Genders[Genders["ssml_gender_voice_unspecified"] = 0] = "ssml_gender_voice_unspecified";
    Genders[Genders["ssml_gender_male"] = 1] = "ssml_gender_male";
    Genders[Genders["ssml_gender_female"] = 2] = "ssml_gender_female";
    Genders[Genders["ssml_gender_neutral"] = 3] = "ssml_gender_neutral";
})(Genders || (Genders = {}));
// const GoogleVoiceTypes = () => {
//   const GoogleVoiceTypes: VoiceTypeNames = {
//     neural: "WaveNet",
//     standard: "Standard"
//   }
//   return GoogleVoiceTypes
// }
export const UnpackageGoogleVoices = (fetchedVoices) => {
    const incoming = fetchedVoices.voices;
    const languageTags = LanguageTags();
    // let languageMap: Map<string, VoiceTypes> = new Map()
    let languageMap = new Map();
    incoming.forEach((element) => {
        const lang = languageTags.get(element.language_codes[0]);
        if (lang !== undefined) {
            const cachedLang = languageMap.get(lang);
            if (cachedLang !== undefined) {
                AddGoogleVoice(element, cachedLang);
            }
            else {
                // const uncachedLang: any = {
                //   standard: [],
                //   neural: []
                // }
                const uncachedLang = [];
                AddGoogleVoice(element, uncachedLang);
                languageMap.set(lang, uncachedLang);
            }
        }
    });
    // const sortedLanguageMap: Map<string, VoiceTypes> = new Map([...languageMap.entries()].sort())
    const sortedLanguageMap = new Map([...languageMap.entries()].sort());
    return sortedLanguageMap;
};
const AddGoogleVoice = (voiceType, voice) => {
    const genderAndType = DetermineGender(voiceType.ssml_gender, voiceType.name);
    const voiceName = voiceType.name.split("-")[2];
    voice.push(voiceName + " " + genderAndType);
    // if (voiceType.name.includes(GenericVoiceTypes.standard)) {
    //   voice.standard.push("Standard " + genderAndType)
    //   return
    // }
    // voice.neural.push("Neural " + genderAndType)
};
const DetermineGender = (genderCode, voiceName) => {
    const alphabetLetter = voiceName.slice(-1);
    switch (genderCode) {
        case Genders.ssml_gender_male:
            return alphabetLetter + " (Male)";
        case Genders.ssml_gender_female:
            return alphabetLetter + " (Female)";
        case Genders.ssml_gender_neutral:
            return alphabetLetter + " (Neutral)";
        default:
            return alphabetLetter + " (Unspecified)";
    }
};
export const PackageGoogleVoices = (data) => {
    const languageCode = PackageHelper(data.language.toString());
    const voiceTypeData = VoiceTypePacker(data, languageCode);
    const name = DetermineVoiceType(voiceTypeData);
    const GoogleData = {
        audioConfig: {
            audioEncoding: "LINEAR16",
            pitch: Number(data.pitch),
            speakingRate: Number(data.speed)
        },
        input: {
            text: data.textarea.toString()
        },
        voice: {
            "languageCode": languageCode,
            "name": name
        }
    };
    const json = JSON.stringify(GoogleData, null, 2);
    return json;
};
const VoiceTypePacker = (data, languageCode) => {
    const voiceData = data["voice-type"].toString().split(" ");
    const voiceTypeData = {
        languageTag: languageCode,
        voiceType: voiceData[0],
        voiceName: voiceData.slice(1.).join(" ")
    };
    return voiceTypeData;
};
const PackageHelper = (language) => {
    const languageTags = LanguageTags();
    let languageCode = "";
    Array.from(languageTags).map(([key, value], id) => {
        if (language === value) {
            languageCode = key;
        }
    });
    return languageCode;
};
const DetermineVoiceType = (voiceTypeData) => {
    return voiceTypeData.languageTag + "-" + voiceTypeData.voiceType + "-" + voiceTypeData.voiceName.split(" ")[0];
};
//# sourceMappingURL=google.js.map