package api

import (
	"encoding/json"
	"io"
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
		byt, err = tts.HandleGoogle(&body)
		break
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

func sendMessage(w http.ResponseWriter, bytes *[]byte) {
	jso, err := json.Marshal(bytes)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.Write(jso)
}
