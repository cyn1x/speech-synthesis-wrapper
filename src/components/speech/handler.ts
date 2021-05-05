import { PackageGoogleVoices, UnpackageGoogleVoices } from "./google"
import { VoiceTypeNames } from "./types"

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
  const fetchedVoices = await HandleGet()

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
      return await HandlePost(body)
    // Not currently supporting other text-to-speech services
  }

}

const HandleGet = async () => {
  const res = await Fetch('GET', null)
  const jso = await res.json()

  return jso
}

const HandlePost = async (body: string) => {
  const res = await Fetch('POST', body)
  const jso = await res.json()

  return jso
}

const Fetch = async (requestMethod: string, bodyContents: string | null) => {
  const response = await fetch('http://localhost:8080/api/google', {
    method: requestMethod,
    headers: {
      'Content-Type': 'application/json'
    },
    body: bodyContents
  })

  return response
}
