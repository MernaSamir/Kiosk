import React, { Component } from 'react'
import * as printingChoices from './components';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, filter, map, omit, includes, groupBy, reject, keys } from 'lodash';
import axios from 'axios';
import loadApps from './apps'
import {multiRequest} from 'helpers'
import applyFilters from 'helpers/functions/filters';
import moment from 'moment'
class Printing extends Component {
    constructor(props) {
        super(props)
        // this.printFiredItem()
        this.watchers()
        // props.setMain("Printing", {print: {
            
        //         active: 'Kitchen',
        //         order: '9ad53e45-ee09-44d6-bf03-71ea29dbf0fe',
        //         items: [
        //           '1f09ea17-68ec-49f4-b500-1f54ef7e162d',
        //           '72fcff8a-0e71-49e7-9a5a-709fc676cec2',
        //           'b84ae37e-7636-4626-8cfa-c274d129072c'
        //         ]
              
        //   }})
    }
    state = {}
    watchers = async () => {
        const {station} = this.props;
        await multiRequest(loadApps(station)).then(()=>{
            this.setState({loaded: true})
        })
    }
    
    afterReceipt = (receipts) => {
        const { setData, setMain } = this.props;
        return axios.patch('/api/v1/orders/receipt/many_edit/', { filter: { id__in: receipts.map(d => d.id) }, data: { printing: false, print_time: new Date() } })
            .then(({ data }) => {
                setData("orders__receipt", data);
                setMain('Printing', { print: {} })
            })
    }
    printDetails = (prints)=>{
        const {setMain} = this.props
        const orders = keys(prints);
        if(orders.length){
            const order = orders[0]
            let items = get(prints, order)
            setMain('Printing', {
                print: {
                    active: 'Kitchen',
                    order,
                    items: items.map(d => d.id),
                    afterPrint: ()=> {
                        this.printDetails(omit(prints, [order]))
                        return Promise.resolve()
                    }
                }
            })

        }
    }
    printReceipts =(receipts)=>{
        const {setMain} = this.props
        if(receipts.length){
            setMain('Printing', {
                print: {
                    active: 'Receipt',
                    receipts
                }
            })

        }
    }
    printFiredItem=()=>{
        const {timer, gun, location, bd} = this.props
        if(gun){
            const details = applyFilters({

                key: 'ListInside',
                path:'orders__details',
                compare: null,
                select: 'end_time',
                selectors: {
                    orders__main: 'order'
                },
                then:{
                    key:'Reject',
                    params:{
                            fired_time: null
                        }
                }
            })
            
            const f_details = filter(details, d=>(timer.format('YYYY-MM-DD:HH-mm') > moment(d.fired_time).format('YYYY-MM-DD:HH-mm')))
            let g_details = null;
            let g_receipts = null;

            gun.get('loc').get(location).get(bd).get('fired').on(data=>{
               g_details = map(omit(data,'_'), (key, val)=>(val))
            })
            gun.get('loc').get(location).get(bd).get('receipts').on(data=>{
                g_receipts = map(omit(data,'_'), (key, val)=>(val))
            })
            const list = reject(f_details, d=>includes(g_details, d.id))
            const receipts = reject(applyFilters({
                key: 'ListInside',
                path:'orders__receipt',
                compare: null,
                select: 'end_time',
                selectors: {
                    orders__main: 'order'
                }
            }), d=>includes(g_receipts, d.id))
            const prints = groupBy(list, 'order')
            this.printDetails(prints)
            if(!list.length){
                this.printReceipts(receipts.map(d=>d.id))
            }
        }
    }

    
    afterKitchen = (items) => {
        const { setData, setMain } = this.props;
        return axios.patch('/api/v1/orders/details/many_edit/', {
            filter: { id__in: items },
            data: { printing: false }
        })
            .then(({ data }) => {
                setData("orders__details", data);
                setMain('Printing', { print: {} })
            })

    }
    render() {
        const {loaded} = this.state;
        if(!loaded){
            return <></>
        }
        this.printFiredItem()
        const {printing} = this.props
         const Active = get(printingChoices, printing )
        return (
            <div className="printing">
                {Active && <Active />}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    printing: get(state.Printing, 'print.active'), //"Receipt"
    printer: get(state.settings__printer.data),
    timer: get(state.main, 'time', ''),
    gun :get (state.guns, 'loc', ''),
    location: get(state.licensing__location, 'active', ''),
    bd: state.orders__business_days.active
})
export default connect(mapStateToProps, mapDispatchToProps)(Printing)


