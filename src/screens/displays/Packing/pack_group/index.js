import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import { map, pickBy, keys, get } from 'lodash'
// import Pagaination from './pagination'
import PackingHeader from './header'
import PackItem from './pack_item'
import applyFilters from 'helpers/functions/filters';

class PackGroup extends Component {

    state = {
        seen: 0
    }

    renderItems = () => {
        const { orderDetails, setMain } = this.props;
        return map(orderDetails, (item, i) => {
            return <PackItem key={i} {...item}
                list={orderDetails}
                orderDetail={item}
                setMain={setMain} />
        })
    }

    handelPageClick = (op) => {
        const { page } = this.state
        const { orderDetails } = this.props
        let pageMax = Math.ceil((keys(pickBy(orderDetails, { parent: null, deleted: null })) || []).length / 6)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            this.setState({ page: page + op })
        }
    }

    serveAllClick = () => {
        const { orderDetails, setMain } = this.props
        // const res = map(filter(orderDetails, { parent: null, deleted: null, status: 'ready' }), d => {
        //     return { ...d, status: 'served' }
        // })
        const res = map(orderDetails, d => {
            return { ...d, status: 'served', serve_time: new Date() }
        })
        setMain('orders__details', { item: { data: res, action: 'bulkEdit' } })
    }

    renderOptions() {
        const { order, orderDetails, setMain } = this.props
        // let pageMax = Math.ceil((keys(pickBy(orderDetails, { parent: null, deleted: null })) || []).length / 6)
        return <div className={classes.header_container}>
            <PackingHeader changeStatus={this.changeStatus} order={order} setMain={setMain} orderDetails={orderDetails} />
            {/* <Pagaination handelPageClick={this.handelPageClick} page={this.state.page}
                pageMax={pageMax} /> */}
        </div>
    }
    changeStatus = ()=>{
        const {orderDetails} = this.props;
        this.setState({
            seen: orderDetails.length
        })
    }
    getOrderStatus(){
        const {orderDetails} = this.props;
        const f_detail = get(orderDetails, '[0]')
        let cls = applyFilters({key: 'packItemStatus', time: this.props.time, to: f_detail.fired_time, late: 10}, f_detail, undefined);
        if(cls != 'late'){
            cls = (this.state.seen == orderDetails.length) ? cls:'new'
        }
        return get(classes, cls)
    }
    render() {
        return (
            <div className={`${classes.packgroup_container} ${this.getOrderStatus()}`}>
                {this.renderOptions()}
                <div className={classes.packitem_container}>
                    {this.renderItems()}
                </div>
                <div className={classes.serveAllBtn} onClick={this.serveAllClick}>Serve All</div>
            </div>
        )
    }
}


const mapStateToProps = (state, props) => ({
    time: state.main.time
})

export default connect(mapStateToProps, mapDispatchToProps)(PackGroup)