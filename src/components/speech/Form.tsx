import React, { useContext, useMemo, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { AudioContext, PlatformContext, ServiceContext } from '../provider'
import HandleUpload from './handler'

const FormContainer = () => {
  const platforms = useContext(PlatformContext)
  const [name, setName] = useState(platforms[0])
  const [base64, setBase64] = useState('')
  const [validated, setValidated] = useState(false)

  const serviceName = useMemo(() => ({name, setName}), [name, setName])

  return (
    <>
      <AudioContext.Provider value={{base64, setBase64}}>
        <ServiceContext.Provider value={serviceName}>
          <Form noValidate validated={validated} onSubmit={HandleSubmit}>
            <ServiceSelection />
            <TextArea />
            <LanguageSelection />
            <VoiceSelection />
            <VoiceStyle />
            <VoiceProfile />
            <SubmitButton />
          </Form>
        </ServiceContext.Provider>
      </AudioContext.Provider>
    </>
  )
}

const ServiceSelection = () => {
  const platforms = useContext(PlatformContext)
  const service = useContext(ServiceContext)

  console.debug(service.name)

  return (
      <Form.Group controlId="formGroupServiceSelection">
        <Form.Control 
          as="select"
          name="serviceSelection"
          disabled
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => service.setName(e.target.value)}
        >
        {platforms.map((svc, id) => 
            <option key={id}>
              {svc}
            </option>
          )}
        </Form.Control>
      </Form.Group>
  )
}

const TextArea = () => {
  return (
    <Form.Group controlId="formGroupTextarea">
    <Form.Label>Text to speak:</Form.Label>
      <Form.Control
        as="textarea"
        name="textToSpeak"
        rows={3}
        placeholder="Replace this with the defaults in config.json" />
    </Form.Group>
  )
}

const LanguageSelection = () => {
  const temp = ["English (Australia)", "English (Canada)"]

  return (
    <Form.Group controlId="formGroupLanguageSelection">
      <Form.Control as="select" name="languageSelection">
        {temp.map((lang, id) => 
          <option key={id}>
            {lang}
          </option>
        )}
      </Form.Control>
    </Form.Group>
  )
}

const VoiceSelection = () => {
  const temp = ["Basic", "WaveNet"]

  return (
    <Form.Group controlId="formGroupVoiceSelection">
      <Form.Control as="select" name="voiceSelection">
        {temp.map((voice, id) => 
          <option key={id}>
            {voice}
          </option>
        )}
      </Form.Control>
    </Form.Group>
  )
}

const VoiceStyle = () => {
  const temp = ["en-US-Standard-A", "en-US-Standard-B"]

  return (
    <Form.Group controlId="formGroupVoiceStyle">
      <Form.Control as="select" name="voiceStyle">
        {temp.map((voice, id) => 
          <option key={id}>
            {voice}
          </option>
        )}
      </Form.Control>
    </Form.Group>
  )
}

const VoiceProfile = () => {
  const temp = ["Default", "Smart watch or wearable"]

  return (
    <Form.Group controlId="formGroupVoiceProfile">
      <Form.Control as="select" name="voiceProfile">
        {temp.map((voice, id) => 
          <option key={id}>
            {voice}
          </option>
        )}
      </Form.Control>
    </Form.Group>
  )
}

const SubmitButton = () => {
  return (
    <Button variant="primary" type="submit">
      Speak it!
    </Button>
  )
}

const HandleSubmit = async (event: React.BaseSyntheticEvent) => {
  event.preventDefault()

  const formData = new FormData(event.target),
    formDataObj = Object.fromEntries(formData.entries())

  console.debug(formDataObj.textToSpeak)

  const synthesisedData = HandleUpload()
  
  PlayVoice(await synthesisedData)
}

const PlayVoice = (data: string) => {
  const speech = new Audio("data:audio/wav;base64," + data)

  speech.play()
}

export default FormContainer
