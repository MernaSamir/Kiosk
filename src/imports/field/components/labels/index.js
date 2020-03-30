import {lazy} from 'react';
export const Label = lazy(()=>import('./simple'))
export const LabelCalc = lazy(()=>import('./calc'))
export const DataDisplay = lazy(()=>import('./data'))