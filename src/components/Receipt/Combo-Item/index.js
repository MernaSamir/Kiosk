import React, { Component } from 'react'
import './combo-item.css'
import './../receipt.css'


export default class ComboItem extends Component {
    render() {
        const {q,item,size,each,total} =this.props
        return (
                <tr className="table-row" style={{borderBottom: this.props.border}}>
                    <td className="q-table"><span >{q}</span></td>
                    <td className="item-table"> <span>{item}</span></td>
                    <td className="size-table"><span>{size}</span></td>
                    <td className="each-table"><span>{each}</span></td>
                    <td className="total-table"><span >{total}</span></td>
                </tr>

                

        )
    }
}
