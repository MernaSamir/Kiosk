
import {get, sortBy, last, filter, keys, toArray, isEmpty} from 'lodash'
const getSortedDetails=(data, state)=>{
  const order = get(data, 'orderDetail.order', '')
  const details = get(state, `orders__details.groups.order.${order}`)
  const sorted_d = sortBy(details, 'created_at')
  return sorted_d
}
const getSortedVDetails=(data, state)=>{
  const order = get(data, 'orderDetail.order', '')
  const details = filter(get(state, `orders__details.groups.order.${order}`), {void: null, parent: null})
  const Vdetails = get(state, `orders__details.groups.void_order.${order}`)
  const tmp = keys(details).length - keys(Vdetails).length
  if (tmp > 1) {
    return true
  }
  return false
}
const getReceipt=(data, state)=>{
  const detail = get(data, 'orderDetail.id', '')
  const receipts = get(state, `orders__receipt_items.groups.details.${detail}`)
  return toArray(receipts)
}
// export const login = (data, state, props) => {
//   return true
// }
//* *********modes ***********/
// export const di = (data, state, props) => {
//   return true
// }
// export const tw = (data, state, props) => {
//   return true
// }
// export const cc = (data, state, props) => {
//   return true
// }
// export const ct = (data, state, props) => {
//   return true
// }
// export const ev = (data, state, props) => {
//   return true
// }
//* *************Cancel******************//
export const cancel_last_added = (data, state, props) => {
  const detail = get(data, 'orderDetail.id', '')

  const details = getSortedDetails(data, state)
  if (last(details).id == detail) {
    return true
  }
  return false
}
export const cancel_last_item_except_only = (data, state, props) => {
  const details = getSortedDetails(data, state)
  const d_details = filter(details, (v)=>v.deleted == false)
  const detail = get(data, 'orderDetail.id', '')
  if (last(d_details).id == detail && d_details.length>1) {
    return true
  }
  return false
}
export const cancel_any_item_except_only = (data, state, props) => {
  const details = getSortedDetails(data, state)
  const d_details = filter(details, (v)=>v.deleted == false)

  if (d_details.length>1) {
    return true
  }
  return false
}
// export const cancel_any_item_even = (data, state, props) => {
//     return true
// }

// export const cancel_order = (data, state, props) => {
//   return true
// }
//* ************* Discount ******************//
export const discount_item_before = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (isEmpty(receipts)) {
    return true
  }
  return false
}
export const discount_seat_before = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (isEmpty(receipts)) {
    return true
  }
  return false
}
export const discount_order_before = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (isEmpty(receipts)) {
    return true
  }
  return false
}
export const discount_item_after = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (receipts.length>0) {
    return true
  }
  return false
}
export const discount_seat_after = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (receipts.length>0) {
    return true
  }
  return false
}
export const discount_order_after = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (receipts.length>0) {
    return true
  }
  return false
}
// export const staff_meals = (data, state, props) => {
//   return true
// }
// export const complimentary = (data, state, props) => {
//   return true
// }
// //* **************** Payments*****************/
// export const fast_cash = (data, state, props) => {
//   return true
// }
// export const pay = (data, state, props) => {
//   return true
// }
// export const payment_back = (data, state, props) => {
//   // console.log('backing')
//   return true
// }
// export const no_print = (data, state, props) => {
//   return true
// }
//* **************takeaway  ***************/

// export const split_order = (data, state, props) => {
//     return true
// }
// // after click pay
// export const cancel_any_after_pay_except_only = (data, state, props) => {
//     return true
// }
// export const cancel_any_i_even = (data, state, props) => {
//     return true
// }
// export const cancel_order_after_pay = (data, state, props) => {
//     return true
// }
//* *****************Dinin ************************/
export const void_any_item_except_only = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (!receipts.length) {
    return getSortedVDetails(data, state)
  }
  return false
}
// export const void_any_item_even_if = (data, state, props) => {
//     const receipts = getReceipt(data, state)
//     return !receipts.length
// }
export const void_any_item_except_only_after_print = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (receipts.length>0) {
    return getSortedVDetails(data, state)
  }
  return false
}
export const void_any_item_after_print = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (receipts.length>0) {
    return true
  }
  return false
}
export const void_any_item_before_print = (data, state, props) => {
  const receipts = getReceipt(data, state)
  if (isEmpty(receipts)) {
    return true
  }
  return false
}

// export const print = (data, state, props) => {
//   return true
// }
// export const reprint_once = (data, state, props) => {
//   // const order = get(data, 'order', '')
//   return true
// }
// export const reprint = (data, state, props) => {
//   return true
// }
// export const reprint_once_after_edit = (data, state, props) => {
//   return true
// }
// export const add_open_item = (data, state, props) => {
//   return true
// }

// export const move_item = (data, state, props) => {
//   return true
// }
// export const move_seat = (data, state, props) => {
//   return true
// }
// export const transfer_table = (data, state, props) => {
//   return true
// }
// export const combine_table = (data, state, props) => {
//   return true
// }
// export const edit_table = (data, state, props) => {
//   return true
// }
//* ********************Customer ********************/
// export const customer_select = (data, state, props) => {
//   return true
// }
// export const customer_view = (data, state, props) => {
//   return true
// }
// export const customer_edit = (data, state, props) => {
//   return true
// }
// export const customer_add = (data, state, props) => {
//   return true
// }
//* ********************admin ********************/

// export const admin_access = (data, state, props) => {
//   return true
// }
// export const admin_summary = (data, state, props) => {
//   return true
// }
// export const admin_day_shift = (data, state, props) => {
//   return true
// }
// export const admin_reports = (data, state, props) => {
//   return true
// }
// export const admin_orders = (data, state, props) => {
//   return true
// }
// export const admin_refund = (data, state, props) => {
//   return true
// }
// export const admin_stock = (data, state, props) => {
//   return true
// }
// export const admin_cash_flow = (data, state, props) => {
//   return true
// }
// export const admin_pays = (data, state, props) => {
//   return true
// }
// export const admin_change_waiter = (data, state, props) => {
//   return true
// }
// export const admin_employee = (data, state, props) => {
//   return true
// }
// export const admin_pos_settings = (data, state, props) => {
//   return true
// }
// export const admin_floor_plan = (data, state, props) => {
//   return true
// }
