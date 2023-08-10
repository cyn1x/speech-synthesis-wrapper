import { GetVoices, PostVoices, services } from "./handler.js";
import AudioManager from "./audio.js";


const audioManager = new AudioManager();

const sessionData: any = {
    defaultService: services.google,
    defaultLanguage: "English (Australia)",
    defaultVoiceType: "Neural2",
    data: undefined
};

function onServiceChange(event: Event) {
    const service = (event.target as HTMLInputElement).value;
    
    populateForm(service);
}

async function playAudio(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.pitch = (document.getElementById("pitch-slider") as HTMLInputElement).value;
    formDataObj.speed = (document.getElementById("speed-slider") as HTMLInputElement).value;
    
    if (!audioManager.paused && audioManager.cached) {
        audioManager.pauseAudio();
    }
    else if (audioManager.cached) {
        audioManager.playAudio();
    }
    else {
        const data = await PostVoices(sessionData.defaultService, formDataObj);
        audioManager.createAudio(data);
        audioManager.playAudio();
    }
}

function downloadAudio() {
    if (audioManager.cached) {
        audioManager.downloadAudio();
    }
}

async function populateForm(service: string) {
    const data: Map<string, any> | undefined = await GetVoices(service);
    sessionData.data = data;
    
    data?.forEach((_, key) => {
        const language = document.getElementById("language");
        if (language) {
            const option = document.createElement("option");
            option.value = key;
            option.innerText = key;

            if (key === sessionData.defaultLanguage) {
                option.selected = true;
            }

            language.appendChild(option);
        }
    })

    populateVoiceTypes();
}

function populateVoiceTypes() {
    const voiceType = document.getElementById("voice-type");

    if (voiceType) {
        voiceType.innerHTML = "";
        const data = sessionData.data?.get((languageSelect as HTMLInputElement).value);
        const uniqueVoiceTypes = [...new Set(data?.map((voice: string) => voice.split(" ")[0]))];
        if (uniqueVoiceTypes) {
            uniqueVoiceTypes.forEach((value: any) => {
                const option = document.createElement("option");
                option.value = value;
                option.innerText = value;

                if (value === sessionData.defaultVoiceType) {
                    option.selected = true;
                }

                voiceType.appendChild(option);
            })
        }
        
        populateVoiceNames();
    }
}

function populateVoiceNames() {
    const voiceName = document.getElementById("voice-name");
    const voiceType = (voiceTypeSelect as HTMLInputElement).value;
    
    if (voiceName) {
        voiceName.innerHTML = "";
        const data = sessionData.data?.get((languageSelect as HTMLInputElement).value);
        const voiceNames = (data?.filter((voice: string) => voice.startsWith(voiceType) ? voice : null));
        if (voiceNames) {
            voiceNames.forEach((value: any) => {
                const option = document.createElement("option");
                option.value = value;
                option.innerText = value;

                voiceName.appendChild(option);
            })
        }
    }
    
    if (audioManager.cached) {
        audioManager.clearAudio();
    }
}

// Initialize event listeners
const serviceSelect = document.getElementById("services");
if (serviceSelect) {
    Array.from(serviceSelect.children).forEach((child) => {
        child.addEventListener("click", onServiceChange);
    });
}

const languageSelect = document.getElementById("language");
if (languageSelect) {
    languageSelect.addEventListener("change", populateVoiceTypes);
}

const voiceTypeSelect = document.getElementById("voice-type");
if (voiceTypeSelect) {
    voiceTypeSelect.addEventListener("change", populateVoiceNames);
}

const voiceNameSelect = document.getElementById("voice-name");
if (voiceNameSelect) {
    voiceNameSelect.addEventListener("change", () => {
        if (audioManager.cached) {
            audioManager.clearAudio();
        }
    });
}

const downloadButton = document.getElementById("download");
if (downloadButton) {
    downloadButton.addEventListener("click", downloadAudio);
}

const formSubmit = document.getElementById("form");
if (formSubmit) {
    formSubmit.dataset.playing = "false";
    formSubmit.addEventListener("submit", playAudio);
}

const textArea = document.getElementById("textarea");
if (textArea) {
    textArea.addEventListener("input", () => {
        if (audioManager.cached) {
            audioManager.clearAudio();
        }
    });
}

populateForm(sessionData.defaultService)

const pitchSlider = document.getElementById("pitch-slider");
const pitchValue = document.getElementById("pitch-value");
const speedSlider = document.getElementById("speed-slider");
const speedValue = document.getElementById("speed-value");

addSliderListeners(pitchSlider, pitchValue);
addSliderListeners(speedSlider, speedValue);
setSliderDisplayValues(pitchSlider, pitchValue);
setSliderDisplayValues(speedSlider, speedValue);

function addSliderListeners(slider: HTMLElement | null, display: HTMLElement | null) {
    if (slider && display) {
        slider.addEventListener("input", () => {
            if (audioManager.cached) {
                audioManager.clearAudio();
            }
            const value = (slider as HTMLInputElement).value;
            display.innerText = value;
        });
    }
}

function setSliderDisplayValues(slider: HTMLElement | null, display: HTMLElement | null) {
    if (slider && display) {
        const value = (slider as HTMLInputElement).value;
        display.innerText = value;
    }
}
