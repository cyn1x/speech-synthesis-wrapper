package tts

import (
	"encoding/json"
	"log"
)

// HandleGoogle ...
func HandleGoogle(data []byte) (GoogleData, error) {
	svc := GoogleData{}
	var err error

	if err = json.Unmarshal([]byte(data), &svc); err != nil {
		log.Println(err)

		return svc, err
	}

	ProcessGoogle(svc)

	return svc, err
}
