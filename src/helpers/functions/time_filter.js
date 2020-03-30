
import {filter, pick}  from 'lodash'
import moment from 'moment'
export const TimeFiltration= (begin, end ,  date, list)=>{
    const dates = date.toObject();
    if(begin.diff(end, 'day') == 0){
      begin = moment({
        ...dates,
        ...pick(begin.toObject(), ['hours', 'minutes', 'seconds'])
      })
      end = moment({
        ...dates,
        ...pick(end.toObject(), ['hours', 'minutes', 'seconds'])
      })
    }
    const avaiDayList = filter(list, d => moment(d.date).isSame( date,'day'))
    if (avaiDayList == []) {
        return []
    }
    else {
      const avai_begin = filter(avaiDayList, d => (moment({
        ...dates,
        ...pick(moment(d.from_hour).toObject(), ['hours', 'minutes', 'seconds'])
      })).isBetween(begin, end, 'hour', '[]'))
      const avai_end = filter(avaiDayList, d => (moment({
        ...dates,
        ...pick(moment(d.to_hour).toObject(), ['hours', 'minutes', 'seconds'])
      })).isBetween(begin, end, 'hour', '[]'))

      return [...avai_end, ...avai_begin]
    }
}