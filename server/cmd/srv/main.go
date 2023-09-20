package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/cyn1x/speech-synthesis-wrapper/pkg/api"
)

// API ...
type API struct{}

func (APIData *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	apiHeaders(w)

	if r.Method == "OPTIONS" {
		handlePreflight()

		return
	}

	if r.URL.Path == "/api/download" {
		filename := "download/" + r.URL.Query().Get("filename")
		w.Header().Set("Content-Disposition", "attachment; filename="+strings.Split(filename, "/")[1]+"")
		w.Header().Set("Content-Type", r.Header.Get("Content-Type"))

		http.ServeFile(w, r, filename)

		return
	}

	log.Println("Request received:", r.Method, r.URL.Path, r.URL.Query())

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
