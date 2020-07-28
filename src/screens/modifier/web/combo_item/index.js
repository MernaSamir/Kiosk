import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, toArray } from 'lodash'

 class Combo extends Component {
    renderTitle = () => {
        const { item } = this.props
        return < div className={classes.title} >
            <p>{`Select your ${item.name} Alternative`}</p>
        </div >
    }
    setActive = id => {
        this.setState({
            active: id
        })
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    activePrice: get(get(state.items__prices, 'data', ''), state.items__prices.active, ''),

    details: get(state.form_actions, 'details', {}),

})

export default connect(mapStateToProps, null)(Combo)
