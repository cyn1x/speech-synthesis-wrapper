import { Dispatch, SetStateAction } from "react";

export interface ServiceSelection {
  platform: string
  setPlatform: Dispatch<SetStateAction<string>>
}
