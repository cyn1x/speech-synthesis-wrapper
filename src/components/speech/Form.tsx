import React, { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { PlatformContext, ServiceContext } from '../provider'
import { GetVoices, PostVoices } from './handler'
import { VoiceTypes } from './types'

const FormController = () => {
  const platformContext = useContext(PlatformContext)
  const [platform, setPlatform] = useState(platformContext[0])
  const [voices, setVoices] = useState<Map<string, VoiceTypes>>();

  useEffect(() => {
    (async () => {
      const voiceList = await GetVoices(platform)

      setVoices(voiceList)
    })();

  }, [platform]);

  return (
    voices === undefined 
      ? <div>Loading...</div> 
      : <ServiceContext.Provider value={{platform, setPlatform}}>
          <FormContainer voiceList={voices} />
        </ServiceContext.Provider>
  )
}

const FormContainer = ({ voiceList }: { voiceList: Map<string, VoiceTypes> }) => {
  const [base64, setBase64] = useState('')
  const [validated, setValidated] = useState(false)

  return (
    <>
      <Form noValidate validated={validated} onSubmit={HandleSubmit}>
        <ServiceSelection />
        <TextArea />
        <VoiceOptions voiceList={voiceList} />
        <SubmitButton />
      </Form>
    </>
  )
}

const ServiceSelection = () => {
  const platformContext = useContext(PlatformContext)
  const serviceContext = useContext(ServiceContext)

  console.debug(serviceContext.platform)

  return (
      <Form.Group controlId="formGroupServiceSelection">
        <Form.Control 
          as="select"
          name="serviceSelection"
          disabled
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => serviceContext.setPlatform(e.target.value)}
        >
        {platformContext.map((svc, id) => 
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

const VoiceOptions = ({ voiceList }: { voiceList: Map<string, VoiceTypes> }) => {
  const [lang, setLang] = useState(voiceList.get('English (Australia)') !== undefined ? 'English (Australia)' : 'English (US)')
  const [type, setType] = useState('Neural')
  const types = ['Neural', 'Standard']

  const voice = voiceList.get(lang)

  if (voice !== undefined) {
    return (
      <>
        <Form.Group controlId="formGroupVoiceLanguage">
          <Form.Control 
            as="select"
            name="voiceLanguage" value={lang}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              {Array.from( voiceList ).map(([ key, value ], id) => {
                if (key === e.target.value) {
                  if (value.standard.length !== 0 && value.neural.length !== 0) {
                    setType('Neural')

                    return
                  }

                  setType('Standard')
                }
              })}
              setLang(e.target.value);
            }
          }
          >
            {Array.from( voiceList ).map(([ key, value ], id) => <option key={id}>{ key }</option>)}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formGroupVoiceType">
        <Form.Control
            as="select"
            name="voiceType"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
        >          
          {Array.from( voiceList ).map(([ key, value ], id) => {
            if (key === lang) {
              return (
                types.map((type, index) => {
                  const neuralIsAvailable = value.standard.length !== 0 && value.neural.length !== 0

                  if (type === 'Neural' && neuralIsAvailable) {
                    return <option key={index}>Neural</option>
                  }
                  else if (type === 'Neural' && !neuralIsAvailable) {
                    return <option key={index} disabled>Neural</option>
                  }

                  return <option key={index}>Standard</option>
                })
              )
            }
          })}
        </Form.Control>
        </Form.Group>
        <VoiceStyle voiceVariants={type === 'Neural' ? voice.neural : voice.standard} />
      </>
    )
  }

  return (
    <div>
      Error
    </div>
  )
  
}

const VoiceStyle = ({ voiceVariants }: { voiceVariants: string[] }) => {
  return (
    <Form.Group controlId="formGroupVoiceStyle">
      <Form.Control as="select" name="voiceStyle">
        {voiceVariants.map((voice, id) => {
          return <option key={id}>{voice}</option>
        })}
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

const HandleLanguageChange = () => {
  
}

const HandleSubmit = async (event: React.BaseSyntheticEvent) => {
  event.preventDefault()

  const formData = new FormData(event.target),
    formDataObj = Object.fromEntries(formData.entries())

  console.debug(formDataObj.textToSpeak)

  const res = PostVoices('Google')

  PlayVoice(await res)
}

const PlayVoice = (data: string) => {
  const speech = new Audio("data:audio/wav;base64," + data)

  speech.play()
}

export default FormController
