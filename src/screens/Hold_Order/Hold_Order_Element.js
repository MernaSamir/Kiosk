import React, { Component } from 'react'
// import './style.css'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment'
export class Hold_Order_Element extends Component {
    state = {
        data: ''
    }

    selectHoldOrder = () => {
        const { history, setMain, id } = this.props;
        setMain('orders__main', { item: { id, hold_time: null, call_name: null, action: 'update' }, active: id })
        history.push('/home');
    }

    deleteHoldOrder = () => {
        const { setMain, id } = this.props;
        setMain('orders__main', { item: { id, end_time: new Date(), action: 'update', not_active: true }, active: '' })
    }
    render() {
        let styleTrash = {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            border: '2px solid #ffffff',
            borderRadius: '50%',
            // padding: '15%'
        }
        return (
            <tr >
                <td onClick={this.selectHoldOrder}><FontAwesomeIcon icon="angle-right" size='2x' color='#ed2d30' /></td>
                <td >{this.props.call_name}</td>
                <td >{moment(this.props.hold_time).fromNow()}</td>
                <td onClick={this.deleteHoldOrder}><FontAwesomeIcon icon="trash-alt" size='2x' style={styleTrash} color='#ed2d30' /></td>
            </tr>

        )
    }
}

export default withRouter(Hold_Order_Element)
