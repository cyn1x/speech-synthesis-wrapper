package tts

import (
	"context"
	"log"

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

	return res
}

// ProcessGoogle sends JSON to the Google text-to-speech cloud API in exchange
// for the synthesised speech
func ProcessGoogle(data GoogleData) []byte {
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

	return res.AudioContent
}
