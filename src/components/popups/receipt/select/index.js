import React, { Component } from 'react';
import classes from './style.less'
import {get, map} from 'lodash'
import { Select } from 'antd';
import applyFilters from 'helpers/functions/filters'
import {connect}  from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
const Option = Select.Option;

class Receipt extends Component {
    state={
        selected:''
    }
    
    renderOptions=()=>{
        const {active, receipts} = this.props
        const  receipt = receipts[active]
        const list = map(receipt.seats, d=>{
            const seat = applyFilters({
                key:'Find',
               path:"orders__order_seats",
               params:{
                   seat_num:d,
                   order:receipt.order
               }
            })
            if(seat){
                if(seat.note){
                    return {id:d, name: `S${seat.seat_num} ${seat.note}`}
                  }
                  else{
                    const customer = applyFilters({
                            path:`parties__customer.data.${seat.customer}`
                    })
                    return {id:d, name: `S${seat.seat_num} ${customer.name}`}
                  }
                
            }
            else{
                return {id:d , name:`seat ${d}`}
            }
        })
        return map(list, (d, index)=>{
            return <Option
            key={index}
            value={get(d,'name','')}
            style={{ width: '100%' }}
        >
            {d.name}
        </Option>
        })
      

    }
    handleChange=(selected)=>{
        const {setMain, receipts, active} = this.props
        this.setState({
            selected
        })
        const  receipt = receipts[active]
        setMain('orders__receipt',{seat_num:{seat_num:selected, receipt:receipt.id}})
        
    }

    render() {
        return (
                <div className={classes.selectdiv}>
                     <Select
                        defaultValue={this.state.selected ? this.state.selected : ""}
                        mode='default'
                        placeholder="Please Select"
                        value={this.state.selected}
                        onChange={this.handleChange}
                    >
                        {this.renderOptions()}
                    </Select>
                </div>
              
        );
    }
}

const mapStateToProps = (state, props) => ({
    receipts: get(state.popup, 'popup.receipts', {}),

})


export default connect(mapStateToProps, mapDispatchToProps)( Receipt) 
