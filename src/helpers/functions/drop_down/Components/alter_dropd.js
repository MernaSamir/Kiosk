import React, { Component } from 'react'
import {  map, get } from 'lodash'
import { Menu, Dropdown, Icon } from 'antd';
import applyFilters from 'helpers/functions/filters';
class DropDown extends Component {
    renderDrop(list) {
        
        const { show } = this.props
        return (<Menu>
            {map(list, (d, idx) => {
                return <Menu.Item key={idx} >{get(d, show)}</Menu.Item>
            })}
        </Menu>)
    }

    render() {
        const { type , appName , show , filter } = this.props
        const reservations = applyFilters({
            key: 'Filter',
            path: "parties__reservation",
            params: {
                _type: null,
            }
          })
        const list = applyFilters({
            key: 'picking',
            reduxName: appName,
            select: filter
            },reservations )
            const Menu = this.renderDrop(list)

        return (
            <div>
                {type=='dropDown'?<Dropdown overlay={Menu} >
                <section>
                 {get(list, `[0].${show}`, '')} {list.length == 1 || <Icon type="down" />}
                </section>
                </Dropdown>
                :
                get(list, `[0].${show}`, '')} {list.length == 1}
            </div>
        )
    }
}
export default DropDown


