import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import { map, get, filter, max, find } from 'lodash'
import classes from './style.less'
import Counter from 'components/counter'
import applyFilters from 'helpers/functions/filters'

class Table extends Component {

    componentDidMount() {
        const { setMain } = this.props
        setMain('dropdowns__delivery_group', {select: 'All'})
    }

    delivery_boys = []
    renderThead = () => {
        const headers = ["Name", "Period"]
        return <tr>{headers.map((d, i) => <th key={i} >{d}</th>)} </tr>
    }

    renderTbody = () => {
        const { groups, select } = this.props
        if (select == 'All') {
            this.delivery_boys = applyFilters({
                key: 'Filter',
                path: "auths__user",
                params: {
                    is_delivery: true
                }
            })
            
        }
        else {
            // console.log(get(groups[parseInt(select)],'id',''), " index")

            this.delivery_boys = applyFilters({
                key: 'Filter',
                path: "auths__user",
                params: {
                    delivery_group_id: get(groups[parseInt(select)], 'id', ''),
                    is_delivery: true
                }
            })
        }
        const locations = applyFilters({
            key: 'Includes',
            path:'employee__employee_locations',
            pick: 'id',
            select: 'user',
          }, undefined, undefined, { data: this.delivery_boys })

          
        this.delivery_boys= filter(this.delivery_boys,d=>find(locations,{user: d.id} ) )
        return map(this.delivery_boys, d_b => (
            <tr className={this.renderClassName(d_b.id)} onClick={this.info.bind(this, d_b)}>
                <td>{d_b.name}</td>
                <td id={classes.period}>{this.renderStatus(d_b.id)}</td>
            </tr>
        ))
    }

    renderClassName = (id) => {
        const { orders } = this.props
        const val = filter(orders, { delivery_person: id, end_time: null })
        if (val.length >= 1) {
            return classes.busy
        }
    }

    renderStatus = (id) => {
        const { orders } = this.props
        const val = filter(orders, { delivery_person: id, end_time: null })
        if (val.length < 1) {
            return 'Available'
        }
        return <Counter start={max(val.map(d => d.created_at))} />
    }

    info = (element) => {
        const { history, setMain, orders } = this.props
        const val = filter(orders, { delivery_person: element.id, end_time: null })
        setMain('auths__user', { activeDel: element.id })
        if (val.length < 1) {
            history.push('/dispatcher/info')
        }
        else {
            if (history.location.pathname.includes(element.username)) {
                history.goBack()
            }
            else {
                history.push('dispatcher/' + element.username)
            }
        }
    }

    render() {
        return (
            <div className={classes.table}>
                <table>
                    <thead>
                        {this.renderThead()}
                    </thead>
                    <tbody>
                        {this.renderTbody()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    // delivery_boys: pickBy(get(state.auths__user, 'data', {}), { is_delivery: true }),
    orders: get(state.orders__main, 'data', {}),
    select: state.dropdowns__delivery_group.select
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Table));