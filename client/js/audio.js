class AudioManager {
    constructor() {
        this.audio = new Audio();
        this.prevAudio = undefined;
        this.audioContext = new AudioContext();
        this.playButton = document.getElementById("play");
        this.img = document.getElementById("audio-icon");
        this.buttonParagraph = this.playButton.getElementsByTagName("p")[0];
        this.filename = "notset";
    }
    createAudio(data) {
        if (this.audio.src === "") {
            this.audio.src = "data:audio/wav;base64," + data.audioContent;
            this.filename = data.filename;
            this.audio.addEventListener("ended", () => {
                this.clearAudio();
            }, false);
        }
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
        }
    }
    playAudio() {
        if (this.prevAudio && !this.prevAudio.paused) {
            this.prevAudio.pause();
        }
        this.audio.play();
        this.playButton.dataset.playing = "true";
        this.buttonParagraph.innerText = "";
        this.img.src = "img/pause-solid.svg";
        this.enableDownloadButton();
    }
    pauseAudio() {
        this.audio.pause();
        this.playButton.dataset.playing = "false";
        this.buttonParagraph.innerText = "Resume";
        this.img.src = "img/play-solid.svg";
    }
    clearAudio() {
        this.prevAudio = this.audio;
        this.audio = new Audio();
        this.buttonParagraph.innerText = "Speak It";
        this.img.src = "img/play-solid.svg";
    }
    downloadAudio() {
        const link = document.createElement('a');
        link.href = "http://localhost:8080/api/download?filename=" + this.filename;
        link.download = this.filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    enableDownloadButton() {
        const downloadButton = document.getElementById("download");
        const downloadImg = downloadButton.getElementsByTagName("img")[0];
        downloadButton.disabled = false;
        downloadImg.style.filter = "invert(0%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)";
    }
    get paused() {
        return this.audio.paused;
    }
    get cached() {
        return this.audio.src !== "";
    }
}
export default AudioManager;
//# sourceMappingURL=audio.js.map