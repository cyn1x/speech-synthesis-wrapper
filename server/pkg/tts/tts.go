package tts

import (
	util "github.com/cyn1x/speech-synthesis-wrapper/pkg/util"
)

// GoogleGet returns the available text to speech voices
func GoogleGet() ([]byte, error) {
	var byt []byte
	var err error

	res := ListGoogle()

	byt, err = util.EncodeJson(res)

	return byt, err
}

// GooglePost returns the synthesised speech from text
func GooglePost(data *[]byte) ([]byte, error) {
	svc := GoogleData{}

	var byt []byte
	var err error

	util.DecodeJson(data, &svc)

	res := SynthesizeText(svc)

	CreatePersistentAudioFile(res)

	byt, err = util.EncodeJson(res)

	return byt, err
}

func CreatePersistentAudioFile(res serverResponse) {
	filepath := "download/"

	go func() {
		util.WriteFile(res.AudioContent, filepath+res.Filename)
	}()

}
