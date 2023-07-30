package util

import (
	"encoding/json"
	"log"
)

func EncodeJson(data interface{}) ([]byte, error) {
	byt, err := json.Marshal(data)

	if err != nil {
		log.Println(err)

		return nil, err
	}

	return byt, nil
}

func DecodeJson(data *[]byte, svc interface{}) (interface{}, error) {
	if err := json.Unmarshal([]byte(*data), &svc); err != nil {
		log.Println(err)

		return nil, err
	}

	return svc, nil
}
