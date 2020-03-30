import * as handlers from './handlers'
import {get} from 'lodash';
export const appReducer = (state = {}, action)=>{
    return get(handlers, action.type, d=>d)(state, action)
}
