import {lazy} from 'react';
export const Photo_Color = lazy(()=>import('./photo_color_note'));
export const color = lazy(()=>import('./photo_color_note/color'));
export const note = lazy(()=>import('./photo_color_note/note'));
export const photo = lazy(()=>import('./photo'));

