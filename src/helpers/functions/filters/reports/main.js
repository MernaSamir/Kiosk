import {get, sumBy, filter} from 'lodash';
export function getFilterData(filters, data) {
  if (get(filters, 'shifts.length')) {
    const orders__main= data.orders__main.filter((d)=>(filters.shifts.includes(d.shift)));
    const orders_ids = orders__main.map((d)=>d.id)
    const orders__details = data.orders__details.filter((d)=>orders_ids.includes(d.order))
    const details_ids = orders__details.map((d)=>d.id)

    data = {
      orders__shifts: data.orders__shifts.filter((d)=>(filters.shifts.includes(d.id))),
      orders__main: data.orders__main.filter((d)=>(filters.shifts.includes(d.shift))),
      orders__details: data.orders__details.filter((d)=>orders_ids.includes(d.order)),
      orders__payment: data.orders__payment.filter((d)=>orders_ids.includes(d.order)),
      orders__receipt: data.orders__receipt.filter((d)=>orders_ids.includes(d.order)),
      orders__receipt_items: data.orders__receipt_items.filter((d)=>details_ids.includes(d.details)),
    }
  }
  return data
}

export const calculateDetailsItemSales = (details, details_objects)=>{
  return sumBy(details, (d)=>{
    let childs = []
    if (d.void) {
      childs = filter(details_objects, {parent: d.void})
    }
    return d.quantity*d.price*get(details_objects, `${d.parent}.quantity`, 1)+sumBy(childs, (v)=>(v.quantity*v.price*d.quantity))
  })
}
