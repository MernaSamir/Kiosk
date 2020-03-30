import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get } from 'lodash'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';

class Compaign extends Component {
    onSubmit = (values) => {

        const { order, setMain } = this.props
        setMain('orders__compaign', {
            item: {
                action: 'add',
                order: order.id,
                name: values.name,
                onSuccess: this.save,

            }
        })
    }
    save = (status, location) => {
        const popup = {
          type: 'Save', visable: true, width: "50%",
          childProps: {
            msg: 'Rating Saved',
            only: true
          }
        }
        return [{
          type: 'set_main_popup',
          data: { popup }
        }]
      }
    TakeRate = () => {

        const { setMain } = this.props
        const popup = {
            type: 'SelectOnly', visable: true, width: "50%",
            childProps: {
                title: "Opinion",
                sub: "Rate :",
                name: "name",
                app: "dropdowns__compaign_rates",
                onClick: this.onSubmit,
                colValue :"name"
            }

        }
        setMain('popup', { popup })

    }
    render() {
        return (
            <button className={classes.compaign_btn} onClick={this.TakeRate}>
                <FontAwesomeIcon icon="smile" className={classes.compaign_icon} />
            </button>
        )
    }
}


const mapStateToProps = (state, props) => ({
    order: get(state.orders__main.data, state.orders__main.active)

});

export default connect(mapStateToProps, mapDispatchToProps)(Compaign);
