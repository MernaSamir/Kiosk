import React, { Component } from 'react'
import { isEmpty, get, map, toArray } from 'lodash'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import styles from './../../style.less'
import { multiRequest } from 'helpers'
import { withTranslation } from 'react-i18next';
import applyFilters from 'helpers/functions/filters'

class Table extends Component {

    getCustomerInfo() {
        const { list, AppList, afterFetch = () => { } } = this.props
        if (isEmpty(list)) {
            multiRequest(AppList, (data) => {
                const list = get(data, 'parties__customer');
                afterFetch(list)
            })
        }
        else {
            afterFetch(toArray(list))
        }
    }

    componentDidMount() {
        this.getCustomerInfo()
    }

    renderHeaders = () => {
        const { Table , t } = this.props
        return map(Table({},t), (d, idx) => {
            return <th key={idx} className={d.class}>{d.head}</th>
        })

    }
    renderRowData = (row) => {
        const { Table, t, assign_customer } = this.props
        return map(Table(row,t, assign_customer), (d, index) => {
            return <td key={index} className={d.class}>
                {get(row, d.view, d.Component)}
            </td>
        })
    }

    mapping = () => {
        const { list, page,filters } = this.props;
        const data = filters?applyFilters({
            key:'chaining_search',
            path:'parties__customer',
            params:{
              name:filters?filters:"",
              id:{
                  path:'parties__customer_contacts',
                  key: 'customer',
                  params:{
                    contact:filters?filters:''
                  }
              }
            }
           
        }):list

        // applyFilters({
        //     key:'Search',
        //     path:'parties__customer',
        //     params:{
        //       name:filters,
        //       customer:{
        //           key:'chaining_search',
        //           path:'parties__customer_contacts',
        //           params:{
        //             contact:filters
        //           }
        //       }
        //     }
           
        // })
        
        
        return map(data, (row, key) => (
            <tr key={key} className={styles.trs}>
                {this.renderRowData(row)}
            </tr>
        )).slice(10 * (page - 1), 10 * page)
    }

    render() {
        return (
            <div className={styles.table_div}>
                <table>
                    <thead>
                        <tr >
                            {this.renderHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.mapping()}
                    </tbody>
                </table>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    get list() {
        return get(state, `parties__customer.data`, {})
    },
    get customer() { return get(this.parties__customer, `data.${get(state.parties__customer, "active")}`, {}) },
    filters:get(state.main, 'search', undefined),
    assign_customer: get(state.orders__details, 'assign_customer',undefined)
})

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Table))