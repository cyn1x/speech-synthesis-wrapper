import { createContext } from 'react';
import { AudioData } from './types';

export const AudioContext = createContext<AudioData>({} as AudioData)
