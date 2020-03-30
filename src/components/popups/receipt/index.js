import React, { Component } from 'react';
import classes from './style.less'
import Actions from './actions'
import Bill from './bill';
import Pagination from './pagination';


import {connect} from 'react-redux'
import {get, isEmpty} from 'lodash'
import applyFilters from 'helpers/functions/filters'
import Select from './select'
import mapDispatchToProps from 'helpers/actions/main'

class Receipt extends Component {

    constructor(props) {
        super(props);
    }
    static onSubmit(props, values) {
        
    }

    state = {
        active: 1
    }

    changeActive = (newActive) => {
        this.setState({
            active: newActive
        })
    }
    renderSelect = () => {
        const { receipts, setMain } = this.props
        const receipt = receipts[this.state.active - 1]

        if (receipt && !isEmpty(receipt.seats)) {
            if (receipt.seats.length > 1) {
                return <Select active={(this.state.active - 1)} />
            }
            else {
                const note = applyFilters({
                    key: 'Find',
                    path: "orders__order_seats",
                    params: {
                        seat_num: receipt.seats[0],
                        order: receipt.order
                    }
                })
                let seat 
                if(note){
                    if(note.note){

                        seat=`S${note.seat_num} ${note.note}`
                    }
                    else{
                        const customer = applyFilters({
                            path:`parties__customer.data.${note.customer}`
                    })
                    seat = `S${note.seat_num} ${customer.name}`
                    }
                } 
                else{
                    seat = `Seat ${receipt.seats[0]}`
                }
                setMain('orders__receipt', { seat_num: seat })
            }
        }
    }


    render() {
         
        return (
            <section className={classes.container}>
                <div className={classes.title}>
                    <p>Print Preview</p>
                </div>

                <div className={classes.flex}>
                    {this.renderSelect()}
                    <Pagination active={(this.state.active - 1)} changeActive={this.changeActive} />
                </div>
                <div className={classes.recepits_div}>
                    <div className={classes.recepit_body}>
                        <Bill active={(this.state.active - 1)} />
                    </div>
                </div>
                <div className={classes.btns}>
                    <div className={classes.actions}>
                        <Actions />
                    </div>

                </div>
            </section>
        );
    }
}


const mapStateToProps = (state, props) => ({
    receipts: get(state.popup, 'popup.receipts', {}),

})
export default connect(mapStateToProps, mapDispatchToProps)(Receipt)
