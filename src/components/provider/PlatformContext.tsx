import { createContext } from 'react';

const SetDefaults = () => {
  return ['Google', 'Microsoft']
}

export const PlatformContext = createContext(SetDefaults())
