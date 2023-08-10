import { PackageGoogleVoices, UnpackageGoogleVoices } from "./google.js"
import { RequestMethod } from "./types.js"

export const services = {
  google: "google",
  microsoft: "microsoft",
  amazon: "amazon"
}

export async function GetVoices(platform: string) {
  const fetchedVoices = await HandleGet(platform);
    
  switch (platform.toLowerCase()) {
    case services.google:
      return UnpackageGoogleVoices(fetchedVoices);
    default: 
      console.log("The requested service is not supported.");
  }
  
}

export async function PostVoices(platform: string, data: { [k: string]: FormDataEntryValue }) {
  switch (platform) {
    case services.google:
      const body = PackageGoogleVoices(data);
      return await HandlePost(platform, body);
    default: 
      console.log("The requested service is not supported.");
  }

}

async function HandleGet(platform: string) {
  const req: RequestMethod = {
    uri: platform,
    method: 'GET',
    body: null
  }

  const res = await Fetch(req);
  const json = await res.json();

  return json;
}

async function HandlePost(platform: string, body: string) {
  const req: RequestMethod = {
    uri: platform,
    method: 'POST',
    body: body
  }

  const res = await Fetch(req);
  const json = await res.json();

  return json;
}

async function Fetch(requestData: RequestMethod) {
  const server = 'http://localhost:8080/api/' + requestData.uri.toLowerCase();

  const response = await fetch(server, {
    method: requestData.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: requestData.body
  });

  return response;
}
