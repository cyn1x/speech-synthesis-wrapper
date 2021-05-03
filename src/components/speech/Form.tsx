import React, { FormEvent, useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { PlatformContext, ServiceContext } from '../provider'
import { GetVoices, PostVoices } from './handler'
import { DynamicFormData, FormStateData, VoiceTypes } from './types'

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
          <FormContainer voiceList={voices} platform={platform} />
        </ServiceContext.Provider>
  )
}

const FormContainer = ({ voiceList, platform }: { voiceList: Map<string, VoiceTypes>, platform: string }) => {
  const platformContext = useContext(PlatformContext)
  const [base64, setBase64] = useState('')
  const [validated, setValidated] = useState(false)

  return (
    <>
      <Form noValidate validated={validated} onSubmit={(e: FormEvent<HTMLFormElement>) => {HandleSubmit(e, platform)}}>
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
  const [getState, setState] = useState({
    lang: voiceList.get('English (Australia)') !== undefined ? 'English (Australia)' : 'English (US)',
    type: 'Neural'
  })

  const data: FormStateData = {
    voiceList: voiceList,
    voiceTypes: ['Neural', 'Standard'],
    voiceLang: getState.lang
  }

  if (data.voiceLang !== undefined) {
    return (
      <>
        <VoiceLanguage state={{getState, setState}} data={data} />
        <VoiceType state={{getState, setState}} data={data} />
        <VoiceStyle state={{getState, setState}} data={data} />
      </>
    )
  }

  return (
    <div>
      Error
    </div>
  )
  
}

const VoiceLanguage = (props: DynamicFormData) => {
  return (
    <Form.Group controlId="formGroupVoiceLanguage">
      <Form.Control 
        as="select"
        name="voiceLanguage" value={props.data.voiceLang}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          {Array.from( props.data.voiceList ).map(([ key, value ], id) => {
            if (key === e.target.value) {
              if (value.standard.length !== 0 && value.neural.length !== 0) {
                props.state.setState({
                  lang: e.target.value,
                  type: 'Neural'
                })

                return
              }

              props.state.setState({
                lang: e.target.value,
                type: 'Standard'
              })
            }
          })}
        }
      }
      >
        {Array.from( props.data.voiceList ).map(([ key, value ], id) => <option key={id}>{ key }</option>)}
      </Form.Control>
    </Form.Group>
  )
}

const VoiceType = (props: DynamicFormData) => {
  return (
    <Form.Group controlId="formGroupVoiceType">
      <Form.Control
          as="select"
          name="voiceType"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.state.setState({
            lang: props.state.getState.lang,
            type: e.target.value
          })}
      >          
        {Array.from( props.data.voiceList ).map(([ key, value ], id) => {
          if (key === props.data.voiceLang) {
            return (
              props.data.voiceTypes.map((type, index) => {
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
  )
}

const VoiceStyle = (props: DynamicFormData) => {
  const voiceVariants = props.data.voiceList.get(props.data.voiceLang)

  if (voiceVariants !== undefined) {
    const list = props.state.getState.type === 'Neural' ? voiceVariants.neural : voiceVariants.standard

    return (
      <Form.Group controlId="formGroupVoiceStyle">
        <Form.Control as="select" name="voiceStyle">
          {list.map((voice, id) => {
            return <option key={id}>{voice}</option>
          })}
        </Form.Control>
      </Form.Group>
    )
  }

  return (
    <option disabled>
      Error
    </option>
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

const HandleSubmit = async (event: FormEvent<HTMLFormElement>, platform: string) => {
  event.preventDefault()

  const formData = new FormData(event.currentTarget),
    formDataObj = Object.fromEntries(formData.entries())

  const res = PostVoices(platform, formDataObj)

  PlayVoice(await res)
}

const PlayVoice = (data: string) => {
  const speech = new Audio("data:audio/wav;base64," + data)

  speech.play()
}

export default FormController
