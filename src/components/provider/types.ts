import { Dispatch, SetStateAction } from "react";

export interface ServiceSelection {
  name: string
  setName: Dispatch<SetStateAction<string>>
}

export interface AudioData {
  base64: string
  setBase64: Dispatch<SetStateAction<string>>
}
