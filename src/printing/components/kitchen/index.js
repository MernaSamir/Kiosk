import React from 'react'
import Header from './components/header'
import Bill from './components/bill'
// import './receipt.css'
import PrinterComponent from 'helpers/components/printer';
import {get, filter, map, groupBy, keys, flatten} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from  'react-redux';
import applyFilters from 'helpers/functions/filters'
import {Translate} from 'helpers/functions/main'
import classes from './style.less'

class Receipt extends PrinterComponent {
    constructor(props) {
        super(props);
        this.fired= props.items
        this.getPrinters(props)
        this.fetchData()
    }
    translate = (text) => {
        const {printerGroup={}} = this.props
        return Translate(text, printerGroup.lang)
    }
    getPrinters(props){
        const {items, table, order} = props;
        let params = {mode: order.mode}
        if(table.zone){
            params.zones = table.zone
        }
        this.mainPrinters = applyFilters({
            path: 'settings__printer.data'
        })
        this.printers = applyFilters({
            key: 'Filter',
            path: 'settings__printer_group',
            params: {
                '_type': 'kitchen'
            },
            then: {
                key: 'oring',
                funs: {
                    params: {
                        key: 'IncludesOne',
                        params,
                    },
                    all: {
                        key: 'Filter',
                        params: {
                            mode: [],
                            zones: []
                        }
                    }
                },
                then: {
                    key: 'keys',
                    levels: ["id"]
                }
            }
        })
        this.itemPrinters = applyFilters({
            key: "Filter",
            path: 'items__item_printers',
            params: {
                active: true
            },
            then: {
                key: 'Includes',
                select: 'group',
                then: {
                    key: 'Grouping',
                    levels: 'item'
                }
            }
        }, undefined, undefined, {data: keys(this.printers)})
        const list = filter(flatten(map(items, this.getDetails.bind(this, props)), d=>(d.printer)))
        // console.log(list)
        this.prints = map(groupBy(list, 'printerGroup.id'), d=>d)
    }

    getDetails = (props, d)=>{
        const detail = applyFilters({path: `orders__details.data.${d}`})
        const self = this;
        const price = applyFilters({path: `items__prices.data.${detail.item}`});
        const salesItem = get(self.props.salesItems, price.sales_item);
        const ps = get(this.itemPrinters, salesItem.id, [{'group': 'default'}])
        const out = map(ps, (d)=>{
            return {
                detail,
                price,
                salesItem,
                salesUnit: get(self.props.units, price.sales_unit),
                item: d,
                order: props.order,
                printerGroup: get(self.printers, d.group, {id: 'default', printers: ['']}),
                get printer(){return get(self.mainPrinters, get(this.printerGroup, 'printers[0]'), {name: 'Kitchen'})}
            }
        })
        return out;

    }
    fetchData = ()=>{
        // const {printing} = this.props
        setTimeout(()=>{
            this.printingKitchen(0);
        }, 50)
        // this.printingKitchen.bind(this, 0)
        // watchRequest({apps: this.getWatch()}).then(this.printingKitchen.bind(this, 0))
    }
    printingKitchen = (active, data)=>{
        const {appendPath, gun, location, bd } = this.props;
        if(active == this.prints.length){
            this.fired = this.fired.reduce((o, d) => ({ ...o, [d]: true }), {})
            // console.log('gunnnn===========',gun)
            if(gun){
                gun.get('loc').get(location).get(bd).get('fired').put(this.fired)
            }
            this.finishPrinting()
        }else{
            const items = this.prints[active]
            appendPath('Printing', 'print.print', {items, printerGroup: get(items, '[0].printerGroup'), printer: get(items, '[0].printer')}, 'assign')
            window.setTimeout(()=>{
                this.print(this.printingKitchen.bind(this, active+1))
            }, 200)
           
        }
    }
    render() {
        const {activePrint, order, printer, printerGroup} = this.props
        const show = printerGroup.show == 'a' ? 'alter_name':'name'
        if(activePrint){
            return (
                <div  className={classes.receiptCon}>
                    <Header show={show}  translate={this.translate} order={order} printer={printer} />
                    <Bill show={show} translate={this.translate} items={activePrint.items} />
                </div>
            )
        }
        return <div></div>
    }
}
const mapStateToProps = (state)=>({
    printing: state.Printing.print,
    order_id: get(state.Printing, 'print.order', ''),
    get order(){return get(state.orders__main.data, this.order_id, {})},
    get table(){return get(state.dinin__tables.data, this.order.table, {})},
    salesItems: state.items__sales_items.data,
    units: state.dropdowns__units_of_measure.data,
    items: get(state.Printing, 'print.items', []),
    activePrint: get(state.Printing, 'print.print'),
    printer: get(state.Printing, 'print.print.printer.name', "Kitchen"),
    printerGroup: get(state.Printing, 'print.print.printerGroup', {}),
    gun: get(state.guns, 'loc', ''),
    location: get(state.licensing__location, 'active', ''),
    bd: state.orders__business_days.active
})
export default connect(mapStateToProps, mapDispatchToProps)(Receipt);
