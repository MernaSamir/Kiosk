import {
  gt, gte, lt, lte, eq, range, get, every, some, last, omit, toArray, filter, first,
  reject, mapValues, isEqual, pick, set, reduce, map, includes, keys as lKeys, assignWith,
  max, min, flattenDeep, has, omitBy, concat, values, round, isArray, merge,
  flatten, uniqBy, find, pickBy, isEmpty, sumBy, sum, isObject, lowerCase, groupBy, forEach, sortBy,
} from 'lodash';
export * from './bill';
export * from './reports';
export * from './authorize';
export * from './order';
export * from './extra_filters';
export * from './common'
export * from './search'
export * from './socket'
export * from './sales'
export * from './order'
import moment from 'moment'
import {Parser} from 'expr-eval';
export * from './app'

const compareKeys = {gt, gte, lt, lte, eq, includes, neq: (a, b)=>(!eq(a, b))}


export const mapExtraKeys = (params, data, state, props)=>{
  // const out = map(data, (d)=>({...d, }))
  // console.log(out)
  return {...data, ...props.applyFilters(params.fun, data, state, props)}
}
export const mapExtraData = (params, data, state, props)=>{
  const out = map(data, (d)=>({...d, ...mapExtraKeys(params, d, state, props)}))
  // console.log(out)
  return out
}
export const SortingByFun = (params, data, state, props)=>{
  return sortBy(toArray(data), (d)=>(props.applyFilters(params.fun, d, state, props)), params.how)
}
export const SortBy = (params, data, state, props)=>{
  return sortBy(toArray(data), params.keys, params.how)
}
export const compare = (params, data, state, props) => {
  return filter(data, (d) => (get(compareKeys, params.compare, compareKeys.eq)(get(state, params.val, params.val), get(d, params.to))))
}
export const compareWithFun = (params, data, state, props) => {
  const comp_val = props.applyFilters(params.compare.fun, undefined, state, props);
  return filter(data, (d) => (get(compareKeys, params.compare.op, compareKeys.eq)(comp_val, props.applyFilters(params.fun, d, state, props))))
}
export const compareData = (params, data, state, props) => {
  return get(compareKeys, params.compare, compareKeys.eq)(get(state, params.val, params.val), get(data, params.to))
}
export const contains = (params, data, state, props) => {
  return filter(data, (d) => includes(lowerCase(get(state, params.val, params.val)), lowerCase(get(d, params.to))))
}
export const containsData = (params, data, state, props) => {
  return includes(lowerCase(get(state, params.val, params.val)), lowerCase(get(data, params.to)))
}
export const Delayed = (params, data, state, props) => {
  setTimeout(() => {
    props.applyFilters(params.fun, data, undefined, props)
  }, params.delay)
}
export const First = (params, data, state, props) => {
  const select = first(toArray(data))
  const def = params.default ? params.default : select
  if (params.display) {
    return get(select, params.display, def)
  }
  return select || def || params.default
}
export const GetKeyDataSelector = (params, data, state, props) => {
  const out = {};
  assignWith({}, data, (s, o, k)=>{
    if (includes(params.levels, k)) {
      out[k] = [...out[k], o];
    }
  })
  return out
}
export function mapSelect(params, data, state, props = {}) {
  return mapValues(params.select, (d) => (get(props.data || data, d, get(state, d, d))))
}
export const mapParams = (params, data, state, props = {}) => {
  return mapValues(params.params, (d) => (d?.key ? props.applyFilters(d, data, state, props) : get(props.data || state, d, d)))
}
export const Selector = (params, data, state) => {
  return get(data, get(state, params.path, params.path), params.default||'');
}
export const GetDataSelector = (params, data, state, props = {}) => {
  const {trans = true, redux} = params;
  if (trans && params.show == 'name') {
    const lang = (get(state.dropdowns__lang.data, state.dropdowns__lang.active, {show: 'n'}))
    const out = get(data || props.data, lang.show, '')
    if (out) {
      return out
    }
  }
  if (redux) {
    const val = get(data || props.data, params.show, '');
    return get(state, `${redux.path}.${val}.${redux.show}`, '')
  }
  return get(data || props.data, params.show, '');
}
export const StateSelector = (params, data, state) => {
  const full_data = get(state, params.path, params.default||'')
  return get(full_data, get(data, params.select, ''), full_data);
}
export const StateSelectorOring = (params, data, state, props) => {
  const out = get(data, params.path, get(state, params.path))
  if (out) {
    return out
  }
  return StateSelectorOring(params.or, data, state, props);
}
export const PartialSelector = (params, data, state, props = {}) => {
  return pick(get(data, get(state, params.path), {}), params.names || (props.fields || []).map((d) => d.name));
}
export const List = (params, data, state) => {
  return filter(data, mapSelect(params, data, state))
}
export const Match = (params, data, state) => {
  return find(data, mapSelect(params, data, state)) || {}
}

export const FindFromState = (params, data, state) => {
  return find(data, mapSelect(params, data, state))
}
export const FindInsideState = (params, data, state, props) => {
  const dp_data = get(state, params.d_path, {});
  return find(dp_data, mapParams(params, data, state, props))
}
export const Filter = (params, data, state, props = {}) => {
  return filter(data, mapParams(params, data, state, {data: props.extra_data, applyFilters: props.applyFilters}))
}
export const FilterSome = (params, data, state, props = {}) => {
  return filter(data, (d)=>some(params.func, (f, k)=>(!!props.applyFilters(f, d, state, props))))
}

export const mapSearch = (data, key, value, props) => {
  return filter(data, (d) => includes(lowerCase(get(d, key, '')), lowerCase(value)))
}
export const Search = (params, data, state, props) => {
  let res = []
  reduce(params.params, (result, value, key) => (
    res = [...res, ...mapSearch(params.data || data, key, value, props)]
  ), {});
  return uniqBy(res, params.unify || 'id')
}
export const mapChainaingSearch = (data, key, value, props) => {
  const search_out = props.applyFilters({
    key: 'Search',
    path: value.path,
    params: {
      ...value.params,
    },
  })
  const list = map(search_out, (d) => (get(d, value.key, '')))
  return filter(data, (d) => includes(list, get(d, key, '')))
  // return mapChainaingSearch ()
  // return map (pick(data,map(search_out, (d)=>(get(d, key, '')))) , d=>(d))
}
export const deepSearch = (params, data, state, props) => {
  return filter(data, (d) => {
    const f_data = props.applyFilters(params.search, d, state, props);
    return some(f_data, (d) => (includes(lowerCase(d || ''), lowerCase(params.value))))
  })
}
export const chaining_search = (params, data, state, props) => {
  let res = []
  reduce(params.params, (result, value, key) => (
    res = [...res, ...isObject(value) ? mapChainaingSearch(params.data || data, key, value, props) :
            mapSearch(params.data || data, key, value, props)]
  ), {});
  return uniqBy(res, params.unify || 'id')
}

export const pickingBy = (params, data, state) => {
  return pickBy(data, mapParams(params, data, state))
}
export const Last = (params, data, state) => {
  return last(toArray(data), params.params)
}
export const ListIncludes = (params, data) => {
  return pickBy(data, (d) => params.selector.includes(get(d, params.match, '')))
}
export const RejectList = (params, data, state) => {
  return reject(data, mapSelect(params, data, state))
}
export const Reject = (params, data, state) => {
  return reject(data, mapParams(params, data, state))
}
export const FindOne = (params, data, state, props) => {
  return find(data, mapSelect(params, data, state, props))
}
export const Find = (params, data, state) => {
  return find(data, mapParams(params, data, state))
}
// export const flattenDeepArray = (params, data, state)=>{
//     return flattenDeep()
// }
export const keys = (params, data, state, props={}) => {
  const out = reduce(toArray(data), (o, v) => {
    if (!params.check_active || (params.check_active && v[params.check_active])) {
      let val = get(v, params.select, v);
      if (params.map) {
        val = props.applyFilters(params.map, v, state, props);
      }
      set(o, `${map(params.levels, (d) => {
        const val = get(v, d, '')
        if (isArray(val)) {
          return val.join('.')
        }
        return val
      }).join('.')}`, val);
    }
    return o;
  },
  {}
  );

  if (params.key_path) {
    return {[params.key_path]: out};
  }
  return out
}
export const keysWithFuns = (params, data, state, props = {}) => {
  const out = reduce(data, (o, v) => {
    let val = get(v, params.select, v);
    if (params.map) {
      val = props.applyFilters(params.map, v, state, props);
    }
    set(o, `${map(params.levels, (d) => (d.key ? props.applyFilters(d, v, state, props) : get(v, d, ''))).join('.')}`, val);
    return o
  }, {})
  if (params.key_path) {
    return {[params.key_path]: out}
  }
  return out
}
export const multiKeysWithFuns = (params, data, state, props = {}) => {
  const out = reduce(data, (o, v) => {
    let paths = ['']
    map(params.levels, (d) => {
      const key = d.key ? props.applyFilters(d, v, state, props) : get(v, d, '')
      if (isArray(key)) {
        paths = map(key, (k)=>(paths.map((d)=>[d, k].filter((d)=>d).join('.'))))
      } else {
        paths = paths.map((d)=>[d, key].filter((d)=>d).join('.'))
      }
    })
    const val = get(v, params.select, v);
    paths.map((d)=>set(o, d, val))
    return o
  }, {})
  if (params.key_path) {
    return {[params.key_path]: out}
  }
  return out
}

export const ObjectLevel = (params, data={}, state, props)=>{
  let res = JSON.stringify(data).replace(/[^{|^}]/g, '')
  while (/}{/g.test(res)) {
    res = res.replace(/}{/g, '')
  }
  return res.replace(/}/g, '').length
}

export const mapObjectToArray = (params, data, state, index = 0, end = params.length - 1, extra = {}) => {
  if (ObjectLevel({}, data) <= 1) {
    return []
  }
  return map(data, (d, k) => (
        index < end ? [...mapObjectToArray(params, d, state, index + 1, end, {[params[index]]: k, ...extra})] : {...d, [params[index]]: k, ...extra})
  ).filter(Boolean)
}
export const ToArray = (params, data, state, props) => {
  return toArray(data)
}
export const ToList = (params, data, state, props) => {
  return [data]
}
export const reverseKeys = (params, data, state) => {
  const keys = params.levels;
  return flattenDeep(mapObjectToArray(keys, data, state));
}
export function replaceTemplate(params, data, state, props) {
  const regex = new RegExp(':(' + lKeys(data).join('|') + ')', 'g');
  const s_regex = new RegExp('\\${(.*?)}', 'g');

  return params.str.replace(regex, (m, $1) => data[$1]).replace(s_regex, (m, $1) => get(state, $1, ''));
}
export const FormatString = (params, data, state, props)=>{
  const mainData = mapValues(params.formats, (d)=>(d.key ? props.applyFilters(d, data, state, props):get(data, d, d)))
  return replaceTemplate({str: params.str}, mainData, state, props)
}
export const selectFromState = (params, data, state, ks = lKeys(params), index = 0, end = ks.length) => {
  if (end == index) {
    return data;
  }
  const key = ks[index];
  index = index + 1;
  const mainParams = get(params, key, {});
  const selected = get(params, mainParams.select, get(params, key));
  let path = `${key}.data.${get(data || state, selected, data || selected)}`
  if (mainParams.path) {
    path = replaceTemplate({str: mainParams.path}, data, state)
  }
  const s_data = get(state, path, selected.params ?
    find(get(state, `${key}.data`), mapParams(selected, data, data)) : '')
  return selectFromState(params, s_data, state, ks, index, end);
}

export const selectMultiFromState = (params, data, state, ks = lKeys(params), index = 0, end = ks.length, out) => {
  if (end == index) {
    return out;
  }
  const key = ks[index];
  index = index + 1;
  const d = get(state, `${key}.data.${get(data, get(params, `${key}.select`, params[key]), '')}`)
  return selectMultiFromState(params, d, state, ks, index, end, {...out, [key]: d});
}
export function chain(params, data, state) {
  const out = selectFromState(params.selectors, data, state)
  return get(out, params.display, out || params.default)
}
export function chainMulti(params, data, state) {
  const out = selectMultiFromState(params.selectors, data, state)
  return out
}
export const ListInside = (params, data, state, props) => {
  return filter(data, (d) => {
    return isEqual(get(props.data || state, params.compare, params.compare), get(chain(params, d, state), params.select, 'id'))
  })
}
export const ListInsideEach = (params, data, state, props) => {
  return filter(data, (d) => {
    const comparing = chain(params, d, state)
    return isEqual(mapValues(params.compare, (d)=>get(props.data || state, d, d)), mapValues(params.select, (d)=>get(comparing, d, d)))
  })
}
export const ListFind = (params, data, state, props) => {
  return filter(data, (d) => {
    return props.applyFilters(params.fun, d, state, {...props})
  })
}
export const pickChain = (params, data, state, props) => {
  return map(data, (d) => {
    const selected_data = chain(params, d, state)
    return get(selected_data, params.select, selected_data)
  })
}
export const ListSelector = (params, data, state, props) => {
  return filter(data, (d) => {
    return chain(params, d, state)
  })
}

export const Includes = (params, data, state, props) => {
  const i_data = map(params.data || props.data || get(state, params.compare, []), (d) => (get(d, params.pick, d)))
  return filter(data, (d) => {
    return includes(i_data, get(d, params.select))
  })
}
export const DataIncludes = (params, data, state, props) => {
  return filter(data, (d) => {
    return includes(get(d, params.select), get(state, params.pick, get(props.data, params.pick, params.pick)))
  })
}
export const IncludesOne = (params, data, state, props) => {
  return filter(data, (d) => {
    return every(mapValues(params.params, (v, k) => ((get(d, k, []) || []).includes(get(state, v, v)))))
  })
}

export const childData = (params, data, state) => {
  const list = get(state, `${params.redux}.data`, {})
  return filter(list, mapSelect(params, data, state))
}

export const joining = (params, data, state, props) => {
  return params.select.map((d) => props.applyFilters(d, data, state, props)).filter(Boolean).join(' - ')
}

export const mapping = (params, data, state, props)=>{
  return map(data, (d)=>(props.applyFilters(params.fun, d, state, props)))
}

export const anding = (params, data, state, props) => {
  const apps = reduce(toArray(params.funs), (o, d, i) => {
    const path = range(0, i).map((d) => 'then').join('.');
    if (!path) {
      return d
    }
    set(o, path, {path: params.path, ...d})
    return o
  }, {})
  return props.applyFilters(apps, data, state, props)
}
export const oring = (params, data, state, props) => {
  const out = flatten(map(params.funs, (fun) => (props.applyFilters(fun, data, state, props))));
  if (params.list) {
    return out
  }
  return uniqBy(out, params.unify || 'id')
}
export const oringObj = (params, data, state, props) => {
  const out = map(params.funs, (fun) => (props.applyFilters(fun, data, state, props)));
  return merge(...out)
}
export const multiData = (params, data, state, props) => {
  return reduce(params.cols, (o, d, index) => ({
    ...o,
    [index]: props.applyFilters(d, get(state, `${d.reduxName || index}.data`, {}), state, {...props, extra: o}),
  }), {})
}
export const includeAny = (params, data, state, props) => {
  let listData = get(state, `${params.reduxName}.data`, props.data)
  listData = filter(listData, params.filters)
  return some(params.func, (d) => (someData(d, listData, state, props)))
}

const getChainedData = (cols = {}, data, state, props, out = {}) => {
  const key = cols.reduxName;
  out = {...out, [key]: props.applyFilters(cols, get(state, `${key}.data`, {}), state, props)}
  if (cols.child) {
    return getChainedData(cols.child, data, state, props, out)
  }
  return out
}
export const chainChildData = (params, data, state, props) => {
  return getChainedData(params.cols, data, state, props);
}

export const everyFilter = (params, data, state, props) => {
  return every(params.func, (d) => (!!props.applyFilters(d, data, state, props)))
}
export const everyData = (params, data, state, props) => {
  return every(data, (d) => (!!props.applyFilters(params.func, d, state, props)))
}

export const someData = (params, data, state, props) => {
  return some(data, (d) => (!!props.applyFilters(params.func, d, state, props)))
}
export const anyFilter = (params, data, state, props) => {
  return some(params.func, (d) => (!!props.applyFilters(d, data, state, props)))
}
export const pickingState = (params, data, state, props) => {
  const ids = map(data, (d) => (get(d, params.select, d)))
  const state_data = get(state, `${params.path}.data`, data)
  return pick(state_data, ids)
}
export const pickingWithData = (params, data, state, props) => {
  const ids = get(data, params.select, data)
  const state_data = get(state, `${params.path}.data`, data)
  return pick(state_data, ids)
}
export const pickByKeys = (params, data, state, props)=>{
  const out = {}
  map(params.keys, (d)=>(merge(out, get(data, d, {}))))
  return out
}
export const picking = (params, data, state, props) => {
  const ids = map(flatten([get(state, params.pick, toArray(params.ids || props.data || data))]), (d) => (get(d, params.select, d)))
  return pick(get(state, params.d_path || `${params.reduxName}.data`, data), ids)
  // return pick(get(state, `${params.reduxName}.data`, data), map(props.data || data, d=>(get(d, params.select, d))))
}
export const pickingFromData = (params, data, state, props) => {
  return map(data, (d) => pick(get(props, params.dPath, data), get(d, params.pick, [])))
  // return pick(get(state, `${params.reduxName}.data`, data), map(props.data || data, d=>(get(d, params.select, d))))
}
export const pickingData = (params, data, state, props) => {
  return map(data, (d) => pick(d, params.pick));
};

export const omitting = (params, data, state, props)=>{
  return omit(data, params.ids)
}
export const Array = (params, data, state, props) => {
  return toArray(data) || []
}
export const pickMax = (params, data, state, props) => {
  return max(map(data, (d) => (get(d, params.select, d))))
}

export const pickMin = (params, data, state, props) => {
  return min(map(data, (d) => (get(d, params.select, d))))
}

export const DateBetween = (params, data, state, props) => {
  return filter(data, (d) => moment(get(d, params.compare)).isBetween(params.date.start, params.date.end))
}

export const sameDate = (params, data, state) => {
  return filter(data, (d) => (isEqual(moment(get(state, params.compare, params.date)).format(params.format), moment(get(d, params.select)).format(params.format))))
}

export const dateRanged = (params, data, state) => {
  const start = moment(params.start).isValid() ? moment(params.start).format(params.format) : (get(state, params.start) ? moment(get(state, params.start)).format(params.format) : '')
  const end = moment(params.end).isValid() ? moment(params.end).format(params.format) : (get(state, params.end) ? moment(get(state, params.end)).format(params.format) : start)
  return filter(data, (d) => {
    const mainDate = moment(get(d, params.select)).format(params.format);
    return mainDate >= start && mainDate <= end
  })
}
export const dateCompare = (params, data, state) => {
  const start = moment(get(params.start, 'value'), get(params.start, 'parse_format')).format(params.format)
  const end = moment(get(params.end, 'value'), get(params.end, 'parse_format')).format(params.format)
  return get(compareKeys, params.op, compareKeys.eq)(start, end)
}

export const dateBetween = (params, data, state) => {
  const date = moment(params.date).format(params.format);
  return filter(data, (d) => {
    const from = moment(get(d, params.from)).format(params.format);
    const to = moment(get(d, params.to)).format(params.format);
    return date >= from && date <= to
  })
}
export const dataBetween = (params, data, state) => {
  const date = params.date;
  return filter(data, (d) => {
    const from = get(d, params.from);
    const to = get(d, params.to);
    return date >= from && date <= to
  })
}

export const ShowBUOM = (params, data, state, props) => {
  const d = get(props, `data.${params.select}`, '')
  let UOM = get(data, d, {});
  if (UOM.is_universal) {
    UOM = find(data, {_type: UOM._type, is_base: true})
  }
  return get(UOM, params.show, '')
}

export const UOMConvert = (params, data, state, props = {}) => {
  const s_u = get(props.data, 'stock_unit', '')
  const item = get(state.stock__items, `data.${get(props.data, 'item', '')}`)
  const r_u = get(item, 'recipe_unit_default', '')
  return `${get(data, `${s_u}.${params.show}`, '??')} = ${get(props.data, 'recipe_unit_ratio', '??')} x ${get(data, `${r_u}.${params.show}`, '??')}`
}
export const Now = (params, data, state, props)=>{
  if (params.format) {
    return moment().format(params.format)
  }
  return moment()
}

export const checkStationType = (params, data, state, props = {}) => {
  const station = get(state.licensing__station.data, state.licensing__station.active, {})
  if (params.not) {
    return params.type != station._type;
  }
  return params.type == station._type
}


export const matchDifferent = (params, data, state, props = {}) => {
  const fullData = get(state, `${params.fullData}.data`, data);
  let picker = get(state, `${params.path}.data`)

  if (params.filter) {
    let filtered = get(state, `${params.filter}`, params.filter)
    if (params.get_filter) {
      filtered = get(state, `${params.get_filter.path}.data.${filtered}.${params.get_filter.key}`)
    }
    if (params.get_keys) {
      filtered = lKeys(omitBy(filtered, (f) => (!f[params.get_keys])))
    } else {
      filtered = concat([], filtered)
    }
    picker = !isEmpty(filtered) ? pickBy(picker, (p) => {
      const condition = !params.check_picker_active ? true : get(p, 'active')
      return (condition && filtered.includes(get(p, params.filter_key, p.id)))
    }) : {}
  }
  const filteredData = map(picker, (f) => get(f, params.pick))
  const return_data = isEmpty(filteredData) && params.is_empty_true ? fullData : pick(fullData, filteredData)

  return params.array ? values(return_data) : return_data
}
export const notIncludeParent = (params, data, state, props = {}) => {
  const fullData = get(state, `${params.fullData}.data`, data);
  const picker = get(state, `${params.path}.data`)
  let filteredData = fullData
  if (!isEmpty(fullData) && params.filter_key) {
    map(picker, (v) => {
      if (has(fullData, `${v[params.pick]}`)) {
        // if full data has the item and its parent remove the item
        if (has(fullData, `${v[params.filter_key]}`)) {
          filteredData = omit({...filteredData}, `${v[params.pick]}`)
        } else if (params.add_table_parent_id) {
          filteredData[v[params.pick]] = {
            ...filteredData[v[params.pick]],
            table_parent_id: v[params.filter_key],
          }
        }
      }
    })
  }
  return filteredData
}

export const notMatchDifferent = (params, data, state, props = {}) => {
  const fullData = get(state, `${params.fullData}.data`, {});
  const filteredData = map(get(state, `${params.path}.data`), (f) => get(f, params.pick))

  return omit(fullData, filteredData)
}
export const selectRequested = (params, data, state, props = {}) => {
  const item = get(props.data, 'id');
  const pr = get(state, params.redux_path);
  const detail = find(state.stock__product_requisition_detail.data, {transaction: pr, item}) || {}
  return detail.quantity
}


export const packItemStatus = (params, data, state, props) => {
  const late = get(params, 'late', 10);
  if (params.voided) {
    return 'voided'
  }
  const from = moment(params.time);
  const to = moment(params.to)
  const diff = from.diff(to, 'minutes')
  if (diff >= late) {
    return 'late'
  }
  return 'normal'
}

export const Eval = (params, data, state, props = {}) => {
  if (isEmpty(data)) {
    return 0
  }
  const parser = new Parser()
  const expr = parser.parse(params.eq);
  if (params.defaults) {
    map(params.defaults, (v, k) => get(data, k) ? null : data[k] = v)
  }
  try {
    return round( expr.evaluate(data), 2);
  } catch (ev) {
    return 0
  }
}
export const GetLast = (params, data, state, props = {}) => {
  return last(toArray(get(state, `${params.path}.data`, data)))
}
export const GetLastKey = (params, data, state, props = {}) => {
  const show = get(data, params.select)
  if (show) {
    return GetLastKey(params, show, state, props)
  }
  return data
}
function getDates(startDate, endDate) {
  const dateArray = [];
  let currentDate = moment(startDate);
  const stopDate = moment(endDate);
  while (currentDate <= stopDate) {
    const date = moment(currentDate).format('DD-MM-YYYY')
    dateArray.push({name: date, id: date})
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}
export const getDatesInBetween = (params, data, state, props = {}) => {
  const {from_date, to_date} = params
  const startDate = get(props, from_date)
  const endDate = get(props, to_date)
  return (startDate || endDate) ? getDates(startDate, endDate) : []
}

export const SumBy = (params, data, state, props) => {
  data = toArray(data)
  return params.col ? sumBy(data, (d)=>Number(get(d, params.col))) : sum(map(data, Number))
}
export const SumByEval = (params, data, state, props) => {
  data = toArray(data)
  const parser = new Parser()
  const expr = parser.parse(params.eq);
  return sumBy(data, (d)=>Number(expr.evaluate(d)))
}

export const IfItems = (params, data, state, props) => {
  return filter(data, (d) => {
    const details = pick(get(props, params.dPath), get(d, params.pick))
    const val = sum(toArray(details))
    return get(compareKeys, params.compare)(val, get(d, params.val, params.val))
  })
}

export const Grouping = (params, data, state, props) => (
  groupBy(data, params.levels)
)

export const storeFilter = (params, data, state, props) => {
  const s_data = get(state, params.d_path, {})
  return filter(s_data, mapValues(params.params, (d) => get(data, d, d)))
}
export const dataPick = (params, data, state, props) => {
  return map(data, (d) => get(d, params.select))
}

export const multiApply = (params, data, state, props) => {
  return mapValues(params.apps, (d, k) => (props.applyFilters(d, get(data, k, data), state, props)))
}
export const not = (params, data, state, props) => {
  // console.log("NOT",props.applyFilters(params.fun, data, state, props))
  return !props.applyFilters(params.fun, data, state, props)
}
export const FilterNot = (params, data, state, props) => {
  return reject(data, (d) => (props.applyFilters(params.fun, d, state, {...props, data: d})))
}
export const groupbyMultilevels = (params, data, state, props) => {
  const o = {}
  forEach(groupBy(data, (d) => (map(params.funs, (fun) => (fun.key ? props.applyFilters(fun, d, state, props) : map(params.levels, (l) => (get(d, l, l))))).join('.')), (d, k) => {
    set(o, k, d)
  }))
  return o
}
export const calLeadTime = (params, data, state, props) => {
  const lead_time = props.applyFilters({
    key: 'chain',
    selectors: {
      'parties__address': 'address',
      'geographies__street': 'street',
      'geographies__area': 'area',
    },
    display: 'time',
  }, params.order)
  const delivery_main = props.applyFilters({key: 'Find', path: 'orders__delivery_main', params: {order: params.order.id}})
  const lead_time_sett = props.applyFilters({
    key: 'Find', path: 'financials__order_lead_time', params: {
      location: get(delivery_main, 'pick_location', params.order.served_location),
    },
  })
  const prep_time = get(lead_time_sett, 'prep_time', 0)
  const buffer_time = get(lead_time_sett, 'buffer_time', 0)
  const surge_timing = get(lead_time_sett, 'surge_timing', 0)
  const details = get(state, `orders__details.groups.order.${params.order.id}`)
  const prep_times = map(details, (d, i) => {
    const prep_time = props.applyFilters({path: `items__prices.data.${d.item}`}).prep_time
    return prep_time
  })
  const final_prep_time = max([...prep_times, prep_time])
  const sub_mode = get(state, `settings__sub_mode.data.${params.order.sub_mode}`, {})
  if (sub_mode.key == 'delivery') {
    return buffer_time + surge_timing + final_prep_time + lead_time
  } else {
    return buffer_time + surge_timing + final_prep_time
  }
}

export const mapDataDe = (params, data, state, props)=>{
  return map(data, (d)=>(props.applyFilters(params.fun, d, state, props)))
}
export const mapData = (params, data, state, props) => {
  return flattenDeep(map(data, (d) => get(d, params.select, d)));
};

export const deepOptionSearch = (params, d, state, props) => {
  if (!params.value) {
    return d;
  }
  let f_data = props.applyFilters(params.search, d, state, props);
  f_data = isArray(f_data) ? f_data : [f_data];
  return some(f_data, (d) =>
    includes(lowerCase(d || ''), lowerCase(params.value))
  );
};
export const FormatDate = (params, data)=>{
  if (!data) return;
  return moment(data).format(params.format || 'DD-MM-YYYY HH:mm')
}


