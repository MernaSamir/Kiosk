import React, { Component } from 'react'
import { map} from 'lodash'

export default class Footer extends Component {
  static onSubmit (props, values){
    const {price, order, setMain} = props
      let detail = {id: uuid(), item:price.id, price: 0, quantity: 1, order}
      console.log('values.items', values.items)
      const grouped = groupBy(values.items,'custom_mix')
      map(grouped, (d, key)=>{
        const custom_mix = applyFilters({
          path:`items__custom_mix.data.${key}`
        })
        let p = sumBy(d, 'quantity') >= custom_mix.price_variance_qty ? custom_mix.price + custom_mix.price_variance : custom_mix.price
        detail = {...detail, price: detail.price += p }
      })
      let data = map(values.items, d=>{
        console.log('ddddd', d)
        if(d.price_variance){
          detail.price += d.price_variance
        }
        return { parent: detail.id, order, quantity:d.quantity, price:0, item:d.item}
      })
      data.push(detail)
      console.log('dataaaa',data)     
  }

  render() {
    return (
      <button type='submit'>ok</button>
    )
  }
}
