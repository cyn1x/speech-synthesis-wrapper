package api

import (
	"fmt"
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
	p := strings.Split(r.URL.Path, "/api/")
	s := strings.Replace(p[1], "/", "", -1)

	body, err := io.ReadAll(r.Body)

	var svc interface{}

	switch s {
	case google:
		svc, err = tts.HandleGoogle(body)
		break
	default:
		http.NotFound(w, r)
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "%+v", svc)

}
