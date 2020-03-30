import * as permissionsFunctions from './map'
import {reduce,get} from 'lodash'

export const applyPermissions = (item ,permissions={},...list) =>{
    // debugger
    // console.log(item, permissions)
    return reduce(permissions, (o, perValue, per)=>(
        o ? get(permissionsFunctions,per, ()=>{true})(item, perValue, ...list):o
    ), true)
}
export const applyFilter = (item , key,...list)=>{
    return (d)=>(applyPermissions(item, get(d, key),...list))
}

export const applyFilterToData = (permissions,...list)=>{
    return (item)=>applyPermissions(item, permissions,...list)
}
export default applyFilter