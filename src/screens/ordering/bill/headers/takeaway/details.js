import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash'
import Note from 'components/order_note'
import classes from './style.less'

class details extends Component {

    customerHandle = () => {
        const { history } = this.props
        history.push('/list/customer');
    }

    getCustomer() {
        const { order } = this.props;
        return applyFilters({
            key: 'GetDataSelector',
            path: "parties__customer",
            show: order.customer
        })
    }

    getMode() {
        const { mode } = this.props;
        return applyFilters({
            key: 'GetDataSelector',
            path: "settings__mode",
            show: mode
        })
    }

    openNote = () => {
        const { order, setMain } = this.props
        const popup = {
            type: 'AddNote',
            width: '70%',
            childProps: {
                note: get(order, 'note', ''),
                title: "Order Note",
                onClick: this.addNote,
            }
        }
        setMain('popup', { popup })
    }

    addNote = (note) => {
        const { setMain, order } = this.props
        setMain('orders__main', { item: { id: order.id, note, action: 'update' } })
    }

    render() {
        const customer = this.getCustomer();
        // console.log(customer)
        const mode = this.getMode();
        const { currentOrder = {}, user, show, order, t } = this.props
        return (
            <>
                <div className={classes.cashier_details}>
                    <div className={classes.chashier}>
                        <p className={classes.cash_num}> {t(mode.name)} # {currentOrder.num}</p>
                        <p className={classes.cash_name}>{t("Cashier")}: {`${user.namee || ''}`}</p>
                    </div>
                    <div className={classes.btns}>
                        {order.mode ? show && <button className={classes.customerName_btn} onClick={this.customerHandle} >
                            {get(customer, 'name', t('Customer Name'))}
                        </button> : undefined}
                        {/* <button className={get(order, 'note',false)?classes.marked:classes.note} onClick={this.openNote}>
                            Note
                        </button> */}
                        {order.mode && show && <Note order={order} ></Note>}
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state, props) => ({
    mode: state.settings__mode.active,
    user: state.main.current,
    show: !props.history.location.pathname.includes('payment'),
    order: get(state.orders__main.data, state.orders__main.active, {}),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(details))
