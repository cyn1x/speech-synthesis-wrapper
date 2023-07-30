# Speech Synthesis Wrapper

Speech Synthesis Wrapper processes text-to-speech requests by providing a preview of the generated audio and allowing the user to download the corresponding audio file.

## Requirements

- [npm](https://www.npmjs.com/) (v6.14.6 or higher)
- [Golang](https://golang.org/) (v1.15.2 or higher)

An API key for the [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech) is required to use this application. The API key should be stored in the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

Visual Studio Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension is recommended for development, or any other web server of your choice.

## Installation

Clone the repository and install the dependencies for the client.

```cmd
git clone https://github.com/cyn1x/speech-synthesis-wrapper
cd speech-synthesis-wrapper
cd client && npm install
```

## Usage

Start the server and client.

```bash
cd server
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
go run ./cmd/srv/ .
```

#### Client

```bash
cd client
# Start a web server of your choice
```

## API Support

- [x] [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech)
- [ ] [Amazon Polly](https://aws.amazon.com/polly/)
- [ ] [IBM Watson Text to Speech](https://www.ibm.com/cloud/watson-text-to-speech)
- [ ] [Microsoft Azure Text to Speech](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/)
