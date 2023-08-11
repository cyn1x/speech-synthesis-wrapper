package tts

import (
	"context"
	"log"
	"time"

	texttospeech "cloud.google.com/go/texttospeech/apiv1"
	texttospeechpb "google.golang.org/genproto/googleapis/cloud/texttospeech/v1"
)

// GoogleData is the parent struct for the audioConfig, input, and voice structs
type GoogleData struct {
	AudioConfig audioConfig `json:"audioConfig"`
	Input       input       `json:"input"`
	Voice       voice       `json:"voice"`
}

// AudioConfig contains the speaking rate, and pitch
type audioConfig struct {
	AudioEncoding string  `json:"audioEncoding"`
	Pitch         float64 `json:"pitch"`
	SpeakingRate  float64 `json:"speakingRate"`
}

// Input holds the text to be synthesised
type input struct {
	Text string `json:"text"`
}

// Voice contains the language or locale and the type or name of the voice
type voice struct {
	LanguageCode string `json:"languageCode"`
	Name         string `json:"name"`
}

// ServerResponse is the JSON response sent back to the client
type serverResponse struct {
	Filename     string `json:"filename"`
	AudioContent []byte `json:"audioContent"`
}

// ListGoogle returns the available text to speech voices
func ListGoogle() *texttospeechpb.ListVoicesResponse {
	ctx := context.Background()

	client, err := texttospeech.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// Performs the list voices request.
	res, err := client.ListVoices(ctx, &texttospeechpb.ListVoicesRequest{})
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("List of voices retrieved successfully\n")

	return res
}

// ProcessGoogle sends JSON to the Google text-to-speech cloud API in exchange
// for the synthesised speech
func SynthesizeText(data GoogleData) serverResponse {
	ctx := context.Background()

	client, err := texttospeech.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	req := texttospeechpb.SynthesizeSpeechRequest{
		AudioConfig: &texttospeechpb.AudioConfig{
			AudioEncoding: texttospeechpb.AudioEncoding_MP3,
			Pitch:         data.AudioConfig.Pitch,
			SpeakingRate:  data.AudioConfig.SpeakingRate,
		},
		Input: &texttospeechpb.SynthesisInput{
			InputSource: &texttospeechpb.SynthesisInput_Text{Text: data.Input.Text},
		},
		Voice: &texttospeechpb.VoiceSelectionParams{
			Name:         data.Voice.Name,
			LanguageCode: data.Voice.LanguageCode,
		},
	}

	res, err := client.SynthesizeSpeech(ctx, &req)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Speech synthesised successfully\n")

	filename := data.Voice.Name
	filename += "_" + time.Now().Format("20060102150405") + ".mp3"

	json := serverResponse{
		Filename:     filename,
		AudioContent: res.AudioContent,
	}

	return json
}
