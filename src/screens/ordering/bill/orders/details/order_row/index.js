import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import { applyPermissions } from 'helpers/permissions'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modifier from './modifier'
import Quantity from './quantity_button'
import MenuButton from './menu_button'
import Combo from './combo'
import CustomMix from './custom_mix'
import { get, round, sumBy, map } from 'lodash'
import {withTranslation} from 'react-i18next'
import classes from './style.less'

class OrderRow extends Component {

    // eslint-disable-next-line class-methods-use-this
    getWithPath(path, show) {
        return applyFilters({
            key: 'GetDataSelector',
            path,
            show
        })
    }

    getDatas() {
        const { orderItem } = this.props;
        const size = this.getWithPath('items__prices', orderItem.item);
        this.datas = {
            size: this.getWithPath("dropdowns__units_of_measure", size.sales_unit),
            price: size,
            item: this.getWithPath("items__sales_items", size.sales_item),
            course: this.getWithPath("dropdowns__courses", orderItem.course)
        }
        return this.datas;
    }

    renderShares = () => {
        const { orderItem, t } = this.props;
        if (orderItem.seats.length > 0) {
            return <tr className={classes.notes} key={orderItem + '5'}>
                {t('shared with seats')} {orderItem.seats.sort().map((i, index) => (<><span key={i}>{i}
                    {!index == orderItem.seats.length - 1 && ','} </span></>))}
            </tr>
        }
        return <></>
    }

    getPermission = () => {
        const { orderItem, receipts } = this.props
        return applyPermissions(orderItem, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts }) &&
            applyPermissions(orderItem, { 'not_shared_over_paid_seat': { key: 'seats', list: "receipts" } }, { receipts })
    }

    activeCourse = () => {
        const { setMain, activeCourse, orderItem } = this.props
        if (activeCourse)
            setMain('orders__details', { active: orderItem.id, item: { id: orderItem.id, course: activeCourse, action: "update" } })
    }

    renderClass = () => {
        const { active, orderItem, activeCourse, popup_course } = this.props;
        const { course } = this.datas;
        if ((active === orderItem.id || (activeCourse && !popup_course && course.id === activeCourse))) {
            return classes.clickedRow
        } else {
            return classes.row;
        }
    }

    renderRow = () => {
        const { orderItem, setMain, lang, modeKey, activeCourse, active, popup_course } = this.props;
        const { course = {}, size, item } = this.datas;
        const item_name = get(item, lang.show)
        const size_name = get(size, lang.show)
        const course_name = get(course, lang.show)
        const permitted = this.getPermission()
        return <tr key={orderItem.id} id={orderItem.item} className={this.renderClass()}
            onClick={this.activeCourse}>
            <Quantity setMain={setMain} orderItem={orderItem} />
            <td className={classes.itemName}>{orderItem.void ? item_name + "(voided)" : item_name} </td>
            <td >{size_name}</td>
            <td  >{modeKey == 'DI' ? course_name : round(orderItem.price, 2)}
                {get(orderItem, 'fired_time') && <FontAwesomeIcon icon="fire" className={classes.firedIcon} />}</td>
            <td >{round(orderItem.price * orderItem.quantity, 2)}</td>
            {/* <td >{get(orderItem, 'fired_time') && <FontAwesomeIcon icon="fire" className={classes.firedIcon} />}</td> */}
            <MenuButton orderItem={orderItem} active={active} setMain={setMain} permitted={permitted} activeCourse={activeCourse}
                course={course} modeKey={modeKey} popup_course={popup_course} />
        </tr>
    }

    renderDoneness = (doneness) => {
        const { donesses } = this.props
        const name = get(get(donesses, doneness), 'name', '')
        return <tr>
            <td className={classes.small}>(D)</td>
            <td className={classes.big}>{name}</td>
        </tr>
    }

    renderNote = (notes) => {
        return <tr>
            <td className={classes.small}>(N)</td>
            <td className={classes.big}>{notes}</td>
        </tr>
    }

    renderRows = () => {
        const { orderItem } = this.props;
        const permitted = this.getPermission()
        if (orderItem.deleted) {
            return <></>
        }
        return <>
            {this.renderRow()}
            {orderItem.is_combo && <Combo key={orderItem.id + '3'} orderItem={orderItem} permitted={permitted} />}
            {orderItem.is_custom_mix && <CustomMix key={orderItem.id + '4'} orderItem={orderItem} permitted={permitted} />}
            {orderItem.doneness && this.renderDoneness(orderItem.doneness)}
            {orderItem.notes && this.renderNote(orderItem.notes)}
            {this.renderShares()}
            {!orderItem.is_combo && !orderItem.is_custom_mix&& <Modifier orderItem={orderItem} key={orderItem.id + '1'}></Modifier>}
            {this.renderTotalPrice(orderItem)}
        </>
    }

    renderTotalPrice = (detail) => {
        const {t} = this.props
        const price = applyFilters({
            path: `items__prices.data.${detail.item}`,
        })
        const modifiers = applyFilters({
            key: 'Filter',
            path: 'orders__details',
            params: {
                parent: detail.id,
                deleted: false
            }
        })

        if (modifiers.length > 0 || detail.is_combo) {
            const mod_prices = sumBy(modifiers, m => (m.price))
            const totalItemPrice = detail.quantity * (detail.price + mod_prices)
            return <tr className={classes.modifier}>
                <td></td>
                <td>{t("Total Item Price")}</td>
                <td></td>
                <td>{totalItemPrice}</td>
                <td></td>
                <td></td>
            </tr>
        }
        return <></>
    }

    render() {
        this.getDatas()
        return (
            this.renderRows()
        )
    }
}

const wrapper = connect((state, props) => ({
    orderItem: get(state.orders__details.data, props.detail),
    activeCourse: state.dropdowns__courses.active,
    active: state.orders__details.active,
    donesses: state.dropdowns__doneness.data,
    popup_course: get(state.popup, 'popup.type', undefined),
    lang: get(state.dropdowns__lang.data, state.dropdowns__lang.active,  {show: 'name'})

}), mapDispatchToProps)(withRouter(withTranslation()(OrderRow)))

export default wrapper;