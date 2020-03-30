import { get ,sumBy, map} from 'lodash';
import applyFilters from 'helpers/functions/filters';

export const sum = (val, params, state)=>{
    const list = applyFilters({
        key: 'Filter',
        path: params.appName,
        params: {
            reservation: params.filter,
        }
    }) 
    
       return sumBy(list ,params.field)
}

