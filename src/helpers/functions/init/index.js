import * as inits from './main';
import {get, flatten, map} from 'lodash';

export default function applyInits(station, stations, data, ...props){
    const out = flatten(map(data, (d, key)=>(get(inits, key, ()=>[])(station, d, data, ...props))))
    return [{type: 'set_main_licensing__station', data: {active: station.id}}, ...out];
}
