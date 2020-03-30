import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'

class SharedOrder extends Component {
    getSeat = (seat) =>{
    }
    openPopup = () => {
        const {setMain} = this.props
        const popup = {type:'MoveSeat', visable:true,width:"50%",
        childProps:{
            onClick: this.getSeat
        }}
        setMain('popup', {popup})
    }
    render() {
        return (
            <div className={classes.btnsContainer}>
                <button>Split Equaly</button>
                <button onClick={this.openPopup.bind(this)}>Split Over Specific Seats</button>
            </div>
        )
    }
}


export default connect(null, mapDispatchToProps)(SharedOrder)
