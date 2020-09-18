import {get, join, map, keys, pick, omit, sortBy, omitBy, drop, round, filter, some, reduce,
  values, sumBy, isEqual, pickBy, every} from 'lodash';

export const getterState = (params, data, state, props)=> {
  const id = map(params.ids, (sid) => get(state, sid, sid)).filter((d) => d).join('.')
  return get(data, `${id}`, get(state, `${params.path}.${id}`))
}

export const getDiffList = (params, data, state, props) => {
  const {from_path, show='name', seperator = '_'} = params
  const diff_list = get(state, `${from_path}.${data.id}`, {})
  const val = join( map(diff_list, (v) => get(v, show, '')), seperator)
  return val
}
export const filterStores = (params, data, state, props) => {
  const valid_locations ={
    ...get(state, `licensing__location.groups.types.sb`, {}),
    ...get(state, `licensing__location.groups.types.stock`, {}),
  }
  const valid_locations_keys = keys(valid_locations);
  return filter(data, (v) => valid_locations_keys.includes(v.main_loc), [])
}

export const FilterToRejects = (params, data, state, props) => {
  const {bool} = params
  const to_id = get(props, `data.id`)
  const ros = get(state, `stock__transaction_ro.groups.tos.${to_id}`)
  let rejects = false
  if (ros) {
    rejects = some(ros, (ro) => {
      const ro_details = get(state, `stock__transaction_ro_detail.groups.transactions_id.${ro.id}`)
      return some(ro_details, (detail) => detail.rejected)
    })
  } else {
    rejects = bool ? false : 'not received'
  }
  return rejects
}
export const FilterPrs = (params, data, state, props) => {
  const pr_id = get(props, `data.id`)
  const pr_details = get(state, `stock__product_requisition_detail.groups.transactions_id.${pr_id}`)
  let complete = false
  if (pr_details) {
    complete = every(pr_details, (pr) => pr.transferred >= pr.quantity)
  }
  return complete
}
export const FilterToRejectsVal = (params, data, state, props) => {
  const {to_path} = params
  const to_id = get(state, to_path)
  const ros = get(state, `stock__transaction_ro.groups.tos.${to_id}`)
  let rejects = 0
  if (ros) {
    const item_variant = get(props, 'data.id')
    rejects = reduce(ros, (o, ro) => {
      const ro_details = get(state, `stock__transaction_ro_detail.groups.transactions.${ro.id}.${item_variant}`)
      return o + sumBy(values(ro_details), 'rejected')
    }, 0)
  }
  return rejects
}

export const pickByFilter= (params, data, state, props) => {
  return pickBy(data, (v) => props.applyFilters(params.params, v, state, {data: v, ...props}))
}

export const getKeys = (params, data, state, props) => {
  const {keys_path, path} = params
  const all_data = get(state, `${path}`, data)
  const getter_key = get(state, keys_path, keys_path);
  return get(all_data, getter_key, {})
}
export const pickKeys = (params, data, state, props) => {
  const {keys_path, keys_pick, path} = params
  const all_data = get(state, `${path}.data`, data)
  const picker_data = get(state, keys_path, {});
  const picker_keys = keys( get(picker_data, get(state, keys_pick, keys_pick), {}));
  return pick(all_data, picker_keys, {})
}

export const omitKeys = (params, data, state, props) => {
  const {keys_path, path, add_id} = params
  const all_data = get(state, `${path}.data`, data)
  const use_path = add_id ? `${keys_path}.${get(state, add_id, add_id)}` : keys_path
  const omiter_keys = keys(get(state, use_path, {}));
  return omit(all_data, omiter_keys, {})
}

const getPriceFifo = (qty, history, sum=0, prices_sum=0) => {
  const sum_with_prices = prices_sum + (get(history, '0.qty', 0) * get(history, '0.price', 0))
  const use_sum = sum + get(history, '0.qty', 0)
  if (use_sum >= qty || !history.length ) {
    return sum_with_prices / use_sum
  }

  return getPriceFifo(qty, drop(history), use_sum, sum_with_prices)
}
export const getWeightPrice = (params, data, state, props) => {
  const {balance_history, qty_path, qty_key} = params
  const item_variant = get(props, `data.id`)
  const qty = get(state, `${qty_path}.${item_variant}.${qty_key}`, 0)
  let all_history = omitBy(get(state, `${balance_history}.${item_variant}`, {}), {'qty': 0})
  all_history =sortBy( all_history, 'created_at')
  return round(qty * getPriceFifo(qty, all_history), 2) || 0
}


export const selectQuantities = (params, data, state, props = {}) => {
  const {redux, column, redux_path, or_column, tr_path} = params
  const item = get(props.data, 'id');
  let transaction = get(state, redux_path, '');
  if (tr_path) {
    transaction = get(state, `${tr_path}.${transaction}`, {})
  }
  const detail = get(state, `${redux}.${transaction}.${item}`, {})
  let out = get(detail, column)
  if ( !out && or_column ) {
    out = get(detail, or_column)
  }
  return out
}

export const selectTo = (params, data, state, props = {}) => {
  const item = get(props.data, 'id');
  const to = get(state, params.redux_path, '');
  const to_data = get(state.stock__transaction_tr.data, to, {})
  let out = ''
  if (params.requested) {
    const detail = get(state, `stock__product_requisition_detail.groups.transactions.${to_data.pr}.${item}.0`) || {}
    out = detail.quantity
  } else if (params.approved) {
    const detail = get(state, `stock__consolidations_detail.groups.prs.${to_data.pr}.${item}`) || {}
    out = detail.approved || detail.allocated
  }

  return out
}

export const selectPoRequested = (params, data, state, props = {}) => {
  const {prs_path, to_store} = params
  const item = get(props.data, 'id');
  const selected_prs = pick(get(state, 'stock__product_requisition.data', {}), get(state, prs_path, []))
  const store = get(state, to_store, to_store)
  return reduce(selected_prs, (o, v) => {
    let val = 0
    if (isEqual(v.to_store, store)) {
      const data = get(state, `stock__product_requisition_detail.groups.transactions.${v.id}.${item}`)
      val = sumBy(values(data), 'quantity')
    }
    return o + val
  }, 0) || ''
}

