import days from './days';
import pos_modules from './pos/modules'
import pos_functions from './pos/functions';
import bo_moduels from './back_office/modules'
import delivery_service from './delivery_service'
import apps from 'helpers/apps';
import {array_to_obj} from 'helpers/functions/array_to_object'
export default ()=>{
    return {
        apps: { data: apps},
        pos_modules: {data: array_to_obj(pos_modules)},
        pos_functions: {data: array_to_obj(pos_functions)},
        bo_moduels: {data: array_to_obj(bo_moduels)},
        delivery_service: {data: array_to_obj(delivery_service)},
        days: {data: array_to_obj(days)}
    }
}
