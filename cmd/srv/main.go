package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/tafenswdigitallab/tts-web-server/pkg/api"
)

func handler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path[1:]
	fmt.Fprintf(w, "Request for %s received", path)

	api.Handler(path)
}

func main() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
