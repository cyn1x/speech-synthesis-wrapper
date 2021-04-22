package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/tafenswdigitallab/tts-web-server/pkg/api"
)

// API ...
type API struct{}

func (APIData *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	apiHeaders(w)

	if r.Method == "OPTIONS" {
		handlePreflight()

		return
	}

	api.Handler(w, r)
}

func handle(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	fmt.Fprintf(w, "Welcome to the home page!")
}

func handlePreflight() {}

func apiHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	mux := http.NewServeMux()

	mux.Handle("/api/", &API{})
	mux.HandleFunc("/", handle)

	log.Fatal(http.ListenAndServe(":8080", mux))
}
