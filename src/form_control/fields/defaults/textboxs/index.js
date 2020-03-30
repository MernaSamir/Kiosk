
import {lazy} from 'react';
export const AddNewGroup = lazy(()=>import('./group_plus'));
export const text = lazy(()=>import('./main'));
export const number = lazy(()=>import('./number'));
export const textbox_relative = lazy(()=>import('./relative'));
export const textArea = lazy(()=>import('./textarea'));
export const password = lazy(()=>import('./password'));