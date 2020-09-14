import moment from 'moment';
import {get} from 'lodash'
export const getTimeStamp = (store)=>{
  return new Promise((resolve, reject)=>{
    const request = store.get('delta');
    request.onsuccess = (event) => {
      // console.log(event.target.result, request)
      const time = get(event.target.result, 'data.time')
      const date = moment().add(time, 'seconds')
      resolve({timestamp: String(date.format('x')), diff: time})
    }
  })
}
export default getTimeStamp
