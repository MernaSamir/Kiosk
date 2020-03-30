import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import styles from './style.less'
import { map, get, keys, reject, sortBy } from 'lodash';
import Footer from './../footer'
import PackGroup from './pack_group'
import applyFilters from 'helpers/functions/filters';

class Packing extends Component {

    state = {
        page: 1
    }
    constructor(props){
        super(props);
        this.displayGroup = applyFilters({
            key: 'Find',
            path: 'settings__printer_group',
            params: {
                // _type: 'packing',
                station: 'licensing__station.active'
            }
        })
    }

    handelPageClick = (op) => {
        const { page } = this.state
        const { orders } = this.props
        let pageMax = Math.ceil((keys(orders) || []).length / 10)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            this.setState({ page: page + op })
        }
    }

    handelSelectOrder = (activePacking) => {
        const { setMain, reset } = this.props;
        setMain('orders__main', { activePacking })
        reset('popup', {
            popup: {
                type: 'OrderView', width: "95%",
                childProps: {
                    activePacking: activePacking,
                }
            }
        })
    }
    renderGroups = () => {
        const { orders } = this.props
        return map(orders, (d, i) => {
            const details = this.getDetails(d);
            const show = details.length
            if(show){
                return <PackGroup orderDetails={details} key={i} order={d} />
            }
        }).filter(d=>d)
    }

    sortByCousreNum = (element) => {
        const { courses } = this.props
        return get(courses, `${element.course}.number`, 0)
    }

    getDetails = (element) => {
        let then = {}
        if(this.displayGroup){
            then = {
                key: 'ListSelector',
                selectors: {
                    items__prices: 'item',
                    items__item_printers: {
                        params: {
                            item: 'sales_item',
                            group: this.displayGroup.id
                        }
                    }
                }
            }
        }
        const details = applyFilters({
            key: 'Filter',
            path: 'orders__details',
            params: {
                order: element.id,
                parent: null,
                void: null
            },
            then: {
                key: 'Reject',
                params: {
                    fired_time: null
                },
                then: {
                    key: 'Reject',
                    params: {
                        status: 'served'
                    },
                    then
                }
            }
        })  
        // return reject(details, { fired_time: null })
        return sortBy(details, ['fired_time', this.sortByCousreNum])
    }

    render() {
        const status = { ready: 'Ready', late: 'Late Orders', served: 'Served', canceled: 'Voided Item' }
        return (<div className={styles.gridContainer}>
            {this.renderGroups()}
            <Footer handelPageClick={this.handelPageClick} page={this.state.page}
                status={status} />
        </div>
        )
    }
}

const mapStateToProps = (state) => ({
    courses: state.dropdowns__courses.data,
    orders: get(state.orders__main, 'data', {}),
    details: reject(state.orders__details, {fired_time: null})
})

export default connect(mapStateToProps, mapDispatchToProps)(Packing);