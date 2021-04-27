const GoogleData = {
  audioConfig: {
    audioEncoding: "LINEAR16",
    pitch: 0,
    speakingRate: 1
  },
  input: {
    text: "Hello, World!"
  },
  voice: {
    "languageCode": "en-US",
    "name": "en-US-Wavenet-G"
  }
}

const HandleUpload = async () => {
  const res = await Fetch()
  const jso = await res.json()

  return jso
}

const Fetch = async () => {
  const response = await fetch('http://localhost:8080/api/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify(GoogleData)
  })

  return response
}

export default HandleUpload
