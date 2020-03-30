import React, { Component } from 'react'
import classes from '../style.less'
import { map , round } from 'lodash'

var Table = (menu = {}, key) => ([
    { head: '', view: key },
    { head: 'Net Sales', view: round(menu.net_sales,2) },



])
export default class Menus extends Component {
    renderHeaders = () => {
        return map(Table(), (d, index) => {
            return <th key={index} className={classes.key}>{d.head}</th>
        })
    }
    renderRowData = (menu, key) => {
        return map(Table(menu, key), (d, index) => {
            return <td className={classes.value} key={index} >{d.view}</td>
        })
    }
    render() {
        const { menus } = this.props
        return (
            <>
                <div className={classes.details}>
                    <p className={classes.title}>Menus</p>
                    <table>
                        <thead >
                            <tr>
                                {this.renderHeaders()}
                            </tr>
                        </thead>
                        <tbody className={classes.tbody_item}>
                        {map(menus, (menu, key) => (
                                <tr key={key}>
                                    {this.renderRowData(menu , key)}
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}
