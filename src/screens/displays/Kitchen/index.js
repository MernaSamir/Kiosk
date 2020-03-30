import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import styles from './style.less'
import KitchenItem from './item'
import Footer from '../footer'
import { keys, filter, reject, get, map, pickBy, sortBy } from 'lodash'
import applyFilters from 'helpers/functions/filters';

class Kitchen extends Component {

    state = {
        page: 1
    }

    handelPageClick = (op) => {
        const { page } = this.state
        const { list } = this.props
        let pageMax = Math.ceil((keys(pickBy(list, { parent: null, deleted: null, status: null })) || []).length / 14)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            this.setState({ page: page + op })
        }
    }

    sortByCousreNum = (element) => {
        const { courses } = this.props
        return get(courses, `${element.course}.number`, 0)
    }
     

    renderItems = () => {
        const { list, setMain } = this.props
        let data = applyFilters({
            key: 'Filter',
            path: 'orders__details',
            params: {
                parent: null,
                status: null,
                void: null
            },
            then: {
                key: "Reject",
                params: {
                    fired_time: null
                }
            },

        })

        data =  filter(data, d=>(Date.parse(d.fired_time )- new Date().getTime()) <= 0 )

        return map(sortBy(data, ['fired_time', this.sortByCousreNum]), (item, i) => {
            return <KitchenItem {...item} key={i} index={i+1} item_id={item.id}
                setMain={setMain} list={list} />
        })
    }

    // eslint-disable-next-line class-methods-use-this
    renderTableHeader() {
        const headers = ["S", "ORD", "Table", "Course", "Item", "Removals","Replacements", "Notes", "Size", "Quantity", "Void", "T (Min)"]
        return <tr>{headers.map((d, i) => <th key={i} >{d}</th>)} </tr>
    }

    renderTable() {
        return <table className={styles.table}>
            <thead> {this.renderTableHeader()}</thead>
            <tbody>{this.renderItems()}</tbody>
        </table>
    }

    render() {
        const status = { late: 'Late Orders', canceled: 'Voided Item' }

        return (
            <div className={styles.container}>
                {this.renderTable()}
                <Footer handelPageClick={this.handelPageClick}
                    status={status} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    list: reject(filter(state.orders__details, {status: null}), {fired_time: null}),
    orders: get(state.orders__main, 'data', {}),
    courses: get(state.dropdowns__courses, 'data', {})
})

export default connect(mapStateToProps, mapDispatchToProps)(Kitchen);
