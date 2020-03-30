import {keys, filter, get} from 'lodash'
export function bestMatchFilter(list, filterObject, oKeys= keys(filterObject), index=0, last=oKeys.length){	
	if(index == last){
		return list[0] || {};
	}
	const key = oKeys[index]
	let out = filter(list, {[key]: get(filterObject, key)})
	if(!out.length){
		out = filter(list, {[key]: null});
    }
	return bestMatchFilter(out, filterObject, oKeys, index+1, last)
}
