import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, get, filter } from 'lodash'
import classes from '../style.less';
import applyFilters from 'helpers/functions/filters';

class ReceiptBill extends Component {
    getShow = (data)=>{
        const {show} = this.props;
        return get(data, show)
    }
    renderItems() {
        const { items } = this.props
        return map(filter(items, d => (get(d, 'detail.parent', true) == null)), this.renderItem.bind(this, ''))

    }
    renderNote = (item, index)=>{
        const {doneness} = this.props;
        return  (item.detail.notes || item.detail.doneness) != null &&
        <tr key={`${index}m`} className={classes.note}>
            <td colSpan={3}>
                ({[item.detail.notes, this.getShow(get(doneness, item.detail.doneness, ''))].filter(d=>d).join(' - ')})
            </td>
        </tr>
    }
    renderItem(className, item, index) {

        const { courses } = this.props;
        const course = get(courses, item.detail.course, {})
        const price = item.price || applyFilters({path: `items__prices.data.${item.detail.item}`})
        const sales_item = item.salesItem || applyFilters({path: `items__sales_items.data.${price.sales_item}`})
        const salesUnit = item.salesUnit || applyFilters({path: `dropdowns__units_of_measure.data.${price.sales_unit}`})
        let childs = []
        let parent = applyFilters({path: `orders__details.data.${item.detail.parent}`}) || {};
        // console.log(parent, item.detail.doneness)
        if(!item.detail.void){
            childs = applyFilters({
                path: "orders__details.data",
                key: "Filter",
                params: {
                    parent: item.detail.id,
                    deleted: false
                }
            }).map(detail=>({detail}))
        }
        return <>
            <tr key={`${index}${className}`} className={`${className} ${item.detail.void && classes.void}`}>
                <td >{`${parent.id ? '':item.detail.quantity}`}</td>
                <td >{`${parent.id ? [parent.quantity, item.detail.quantity].filter(d=>d).join('x'):''}`+` ${this.getShow(sales_item)} - ${this.getShow(salesUnit)}`}</td>
                <td >{this.getShow(course)}</td>
            </tr>
            {this.renderNote(item, index)}


            {map(childs, this.renderItem.bind(this, classes.modifier))}
            {/* {map(filter(items, d => (get(d, 'detail.note', '') != null)), this.renderItem.bind(this, classes.modifier))} */}

        </>


    }
    render() {
        return (
            <div className={classes.TableDiv}>
                <hr />
                <table >
                    <tbody>
                        {this.renderItems()}
                    </tbody>
                </table>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    courses: state.dropdowns__courses.data,
    doneness: state.dropdowns__doneness.data
})
export default connect(mapStateToProps, null)(ReceiptBill)
