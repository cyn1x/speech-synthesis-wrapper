import { PackageGoogleVoices, UnpackageGoogleVoices } from "./google"
import { RequestMethod, VoiceTypeNames } from "./types"

const Services = () => {
  const services = {
    google: "Google"
  }

  return services
}

export const GenericVoiceTypes = () => {
  const GenericVoiceTypes: VoiceTypeNames = {
    neural: "Neural",
    standard: "Standard"
  }

  return GenericVoiceTypes
}

export const GetVoices = async (platform: string) => {
  const services = Services()
  const fetchedVoices = await HandleGet(platform)

  switch (platform) {
    case services.google:
      return UnpackageGoogleVoices(fetchedVoices)
    // Not currently supporting other text-to-speech services
  }

}

export const PostVoices = async (platform: string, data: { [k: string]: FormDataEntryValue }) => {
  const services = Services()

  switch (platform) {
    case services.google:
      const body = PackageGoogleVoices(data)
      return await HandlePost(platform, body)
    // Not currently supporting other text-to-speech services
  }

}

const HandleGet = async (platform: string) => {
  const requestData: RequestMethod = {
    uri: platform,
    method: 'GET',
    body: null
  }

  const res = await Fetch(requestData)
  const jso = await res.json()

  return jso
}

const HandlePost = async (platform: string, body: string) => {
  const requestData: RequestMethod = {
    uri: platform,
    method: 'POST',
    body: body
  }

  const res = await Fetch(requestData)
  const jso = await res.json()

  return jso
}

const Fetch = async (requestData: RequestMethod) => {
  const server = 'http://localhost:8080/api/' + requestData.uri.toLowerCase()

  const response = await fetch('data.json', {
    method: requestData.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: requestData.body
  })

  return response
}
