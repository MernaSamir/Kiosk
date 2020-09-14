import {get, mapValues, set, map} from 'lodash'
import * as funcs from './funcs'

export const front_calcs = (obj) => {
  const updates = []
  const counters = {}
  const search = (obj) => {
    return mapValues(obj, (d) => {
      if (typeof d === 'object') {
        if (get(d, 'front_calc')) {
          const type = get(d, 'front_calc')
          const count = get(counters, type, 1)
          const update = {...d, path: `front_calcs.${type}${count}`}
          updates.push(update)
          set(counters, type, count+1)
          return update
        } else return search(d)
      } else return d
    })
  }
  const table = search(obj)
  return {table, updates}
}

export const calcField = (obj, totals) => {
  const fun = get(obj, 'front_calc')
  return get(funcs, fun, (d, i)=>d)(obj, totals)
}

export const apply_front_calcs = (tableUpdates, totals) => {
  const updates = get(tableUpdates, 'updates', [])
  if (!updates.length) return totals

  map(updates, (obj) => {
    set(totals, obj.path, calcField(obj, totals))
  })
  return totals
}
