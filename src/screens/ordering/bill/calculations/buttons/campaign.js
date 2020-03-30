import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get } from 'lodash'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';

class Compaign extends Component {
    

    openPopup = () => {

        const { setMain, calc } = this.props
        const popup = {
            type: 'Campaign', visable: true,
            childProps:{
                data:calc.gifts.map(i=>({item:i})),
                promo: calc.gift_promo
            }

        }
        setMain('popup', { popup })

    }
    render() {
        return (
            <button className={classes.compaign_btn} onClick={this.openPopup}>
                <FontAwesomeIcon icon="gift" className={classes.compaign_icon} />
            </button>
        )
    }
}


const mapStateToProps = (state, props) => ({
    order: get(state.orders__main.data, state.orders__main.active)

});

export default connect(mapStateToProps, mapDispatchToProps)(Compaign);
