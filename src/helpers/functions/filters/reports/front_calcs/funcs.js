import {get, round} from 'lodash'

export const average = (params, data) => {
  let {nume='', deno='', rounding=2} = params
  nume = get(data, nume, 0)
  deno = get(data, deno, 0)
  return nume == 0 ? 0 : round(nume/deno, rounding)
}

