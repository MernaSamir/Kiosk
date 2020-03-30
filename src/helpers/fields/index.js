import * as Fields from './main';
import {get, set} from 'lodash';
export default function(list){
    let int = 0, n=list.length;
    let item = list[int];
    int = 1;
    let out = {...get(Fields, item, {})}, childs = ["child"];
    while(int < n){
        item = list[int]
        set(out, childs.join('.'), {...get(Fields, item, {})})
        childs.push("child")
        int++
    }
    
    return out
}