package tts

import (
	"encoding/json"
	"fmt"
	"log"
)

// HandleGoogle ...
func HandleGoogle(data *[]byte) ([]byte, error) {
	svc := GoogleData{}

	var byt []byte
	var err error

	if err = json.Unmarshal([]byte(*data), &svc); err != nil {
		log.Println(err)

		return byt, err
	}

	fmt.Println(svc)

	byt = ProcessGoogle(svc)

	return byt, err
}
