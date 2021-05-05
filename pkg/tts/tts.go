package tts

import (
	"encoding/json"
	"log"
)

// GoogleGet returns the available text to speech voices
func GoogleGet() ([]byte, error) {
	var byt []byte
	var err error

	res := ListGoogle()

	byt, err = encode(res)

	return byt, err
}

// GooglePost returns the synthesised speech from text
func GooglePost(data *[]byte) ([]byte, error) {
	svc := GoogleData{}

	var byt []byte
	var err error

	decode(data, &svc)

	res := ProcessGoogle(svc)

	byt, err = encode(res)

	return byt, err
}

func encode(data interface{}) ([]byte, error) {
	byt, err := json.Marshal(data)

	if err != nil {
		log.Println(err)

		return nil, err
	}

	return byt, nil
}

func decode(data *[]byte, svc interface{}) (interface{}, error) {
	if err := json.Unmarshal([]byte(*data), &svc); err != nil {
		log.Println(err)

		return nil, err
	}

	return svc, nil
}
