import { createContext } from 'react';
import { ServiceSelection } from './types';

export const ServiceContext = createContext<ServiceSelection>({} as ServiceSelection)
