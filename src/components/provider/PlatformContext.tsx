import { createContext } from 'react';

const SetDefaults = () => {
  return ['Google']
}

export const PlatformContext = createContext(SetDefaults())
