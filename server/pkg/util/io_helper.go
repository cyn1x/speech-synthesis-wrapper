package util

import (
	"io"
	"log"
	"os"
)

func WriteFile(data []byte, path string) {
	f, err := os.Create(path)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	_, err = f.Write(data)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("File saved to %s\n", path)
}

func ReadFile(path string) []byte {
	f, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	data, err := io.ReadAll(f)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("File read from %s\n", path)

	return data
}
