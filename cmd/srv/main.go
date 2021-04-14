package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/tafenswdigitallab/tts-web-server/pkg/api"
)

// APIHandler ...
type APIHandler struct{}

func (apiHandler *APIHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Println("Verifying request")

	path := r.URL.Path[1:]

	fmt.Fprintf(w, "Requesting path %s\n", path)
	api.Handler(w, r)
}

func handle(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	fmt.Fprintf(w, "Welcome to the home page!")
}

func main() {
	mux := http.NewServeMux()

	mux.Handle("/api/", &APIHandler{})
	mux.HandleFunc("/", handle)

	log.Fatal(http.ListenAndServe(":8080", mux))
}
