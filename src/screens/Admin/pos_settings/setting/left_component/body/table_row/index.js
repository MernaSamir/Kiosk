import React, { Component } from 'react'
import classes from '../../../style.less'
import Dropdown from "components/dropdown"
import { map, pickBy } from 'lodash'
export default class TableRow extends Component {

    state = {
        currentItem: 1,
    }

    setCurrentItem = (id) => {
        this.setState({
            currentItem: id
        })
    }

    renderTD = () => {
        const { menu, category } = this.props
        const { currentItem } = this.state
        return map(menu, (d, index) => {
            let cats = pickBy(category, { active: true, custom_menu: d.id })
            let first = { id: 1, name: 'None' }
            cats = { ...{ first }, ...cats }
            return <tr>
                <td>{d.name}</td>
                <td className={classes.drop_td}>
                    <Dropdown data={cats}
                        btnClass={classes.drop}
                        clickedclass={classes.drop}
                        onChange={this.setCurrentItem}
                        value={currentItem} />
                </td>

            </tr>
        })

    }

    render() {
        return (
            <div className={classes.table_div}>
                <p>Default Category per Menu</p>
                <table>
                    <tbody>
                        {this.renderTD()}
                    </tbody>
                </table>
            </div>
        )
    }
}