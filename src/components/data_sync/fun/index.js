import * as funs from './main'
import {map} from 'lodash';

export default function(io, props){
    map(funs, (d)=>(d(io, props)))
}