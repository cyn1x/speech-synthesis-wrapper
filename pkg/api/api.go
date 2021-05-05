package api

import (
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/tafenswdigitallab/tts-web-server/pkg/tts"
)

const (
	google = "google"
)

// Handler transmits data to be processed by the tts module and returns the
// received data to the client
func Handler(w http.ResponseWriter, r *http.Request) {
	uri := determineURI(r)
	body, err := io.ReadAll(r.Body)

	var byt []byte

	switch uri {
	case google:
		byt, err = handleGoogleRequest(r.Method, &body)
		break
	// Not currently supporting other text-to-speech services
	default:
		http.NotFound(w, r)
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	sendMessage(w, &byt)

}

func determineURI(r *http.Request) string {
	p := strings.Split(r.URL.Path, "/api/")
	s := strings.Replace(p[1], "/", "", -1)

	return s
}

func handleGoogleRequest(method string, data *[]byte) ([]byte, error) {
	var byt []byte
	var err error

	if method == http.MethodGet {
		byt, err = tts.GoogleGet()
	} else if method == http.MethodPost {
		byt, err = tts.GooglePost(data)
	}

	return byt, err
}

func sendMessage(w http.ResponseWriter, byt *[]byte) {
	len, err := w.Write(*byt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	log.Printf("%v bytes written", len)
}
