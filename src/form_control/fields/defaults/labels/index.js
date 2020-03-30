import {lazy} from 'react'
export const DisplayText = lazy(()=>import('./text'));
export const DisplayValue = lazy(()=>import('./value'));
export const DisplayRelativeValue = lazy(()=>import('./relative_value'));
export const display_redux = lazy(()=>import('./display_redux'));
export const DataDisplay = lazy(()=>import('./data'));
export const CustomLabel = lazy(()=>import('./custom'));