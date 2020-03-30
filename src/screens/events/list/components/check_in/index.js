import React, { Component } from 'react'
import check from 'assets/images/Icons/checkin.svg'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CheckIn extends Component {
    openCheckIn=()=>{
        const { setMain ,reservation } = this.props
        setMain("parties__reservation",{active: reservation.id})

        const popup = {
          type: 'CheckIn', visable: true, width: "100%",
        }
 
        setMain('popup', { popup })
    }
    render() {
        const { reservation } = this.props

        return (
            <div>
                <button  disabled={reservation.sub_type=='SM'} className={classes.actions} onClick={this.openCheckIn}>
                    <FontAwesomeIcon icon={['fas', 'user-plus']} />
                </button>
            </div>
        )
    }
}
export default connect(null, mapDispatchToProps)(CheckIn)
