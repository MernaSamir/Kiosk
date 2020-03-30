import * as mainHandlers from './handlers'
import {get} from 'lodash';
export const buildReducers = (name)=>{
    const handlers = {
        [`set_main_${name}`]: mainHandlers.set_main,
        [`set_data_${name}`]: mainHandlers.set_data,
        [`omit_data_${name}`]: mainHandlers.omit_data,
        [`remove_data_${name}`]: mainHandlers.remove_data,
        [`set_path_${name}`]: mainHandlers.set_path,
        [`append_path_${name}`]: mainHandlers.append_path,
        [`remove_main_${name}`]: mainHandlers.remove_main,
        [`reset_all_${name}`]: mainHandlers.reset_all,
    };
    return {
        [name]: (state = {}, action)=>( get(handlers, action.type, d => d)(state, action))
    }
}

export default buildReducers;
