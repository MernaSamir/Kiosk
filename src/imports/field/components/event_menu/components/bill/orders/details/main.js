import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import {isEqual, pick} from 'lodash'
import { map, reject } from 'lodash';
import OrderRow from './order_row';
import mapDispatchToProps from 'helpers/actions/main';
import { setMain } from '../../../../../../../../helpers/actions/main';
class Orders extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['list']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }
    renderBillItems = () => {
        const {list, field ,handleChange } = this.props
        return map(reject(list, d=>(d.parent)),(detail, index) => {
            
            return <OrderRow key={index} orderItem={detail}
              detail={detail.id}  field={field} 
              handleChange={handleChange}/>
        })


    }
    render() {
        return (
            <tbody>
                {this.renderBillItems()}
            </tbody>
        )
    }
}

export default withRouter(connect(null, mapDispatchToProps)(Orders))

