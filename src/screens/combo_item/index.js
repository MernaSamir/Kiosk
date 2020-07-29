import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import Types from './types'
import classes from './style.less'
import Alters from './alters'
import Form from 'helpers/wrap/form.js'
import applyFilters from 'helpers/functions/filters'

class Combo extends Component {
    static onSubmit(){
        
    }
    state = {
        active: {}
    }
    renderTitle = () => {
        const { item } = this.props
        return < div className={classes.title} >
            <p>{`Select your ${item.name} Alternative`}</p>
        </div >
    }
    getContent = () => {
        const { onClick, activeDetail } = this.props
        const {active}= this.state
    const selected= !isEmpty(active)? active:this.list[0] 
    console.log(selected,"selllll")
    selected
    return <Alters active={selected}  getInfo={this.getInfo}/>
   


    }
    getList = () => {
        const { activePrice } = this.props
        const list = applyFilters({
            key: 'Filter',
            path: `items__combo`,
            params: {
                combo_size: activePrice.id
            }
        })
        return list
    }
    setActive = item => {
        console.log(item,"ooooooooooo")
        this.setState({
            active: item
        })

    }
    getInfo = (l, selector) => {

        const item = applyFilters({
            key: 'chain',
            selectors: {
                'items__prices': selector,
                'items__sales_items': 'sales_item'
            },
        }, l)
        const size = applyFilters({
            key: 'chain',
            selectors: {
                'items__prices': selector,
                'dropdowns__units_of_measure': 'sales_unit'
            },
        }, l)
        return { name:item.name, size:size.name }
    }
    render() {
       this.list = this.getList()
        return (
            <div className={classes.modDiv}>
            <div className={classes.cat}>
                <Types setActive={this.setActive} active={this.state.active||list[0]} getInfo={this.getInfo} list={this.list}/>
                {this.getContent()}

                {/* <Cart /> */}
            </div>

            {/* <div className={classes.btnContainer}>
                <button className={classes.back} onClick={this.goBack}> Back</button>
                {this.state.active == 'Extra' &&
                    <button type='button' className={classes.next} onClick={this.nextNo}>Next - NO</button>}
                {this.state.active == 'NO' &&
                    <button type='submit' className={classes.next}>Next - Quantity</button>}  
                    
            </div> */}
        </div>
            // <div>
            //     <Types setActive={this.setActive} active={this.state.active} />
            //     {this.renderTitle()}
            // </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    activePrice: get(get(state.items__prices, 'data', ''), state.items__prices.active, ''),

    details: get(state.form_actions, 'details', {}),

})

export default connect(mapStateToProps, null)(Form(Combo))
