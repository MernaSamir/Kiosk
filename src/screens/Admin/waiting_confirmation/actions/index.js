import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../style.less'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import actions from './actions'
import { get, map } from 'lodash'

class ViewComponent extends Component {
  takeAction = (action) => {
    get(this, action.action, () => { })(action)
  }

  sendToLoc = () => {
    const { setMain, order } = this.props
    setMain('orders__main', {
      item: {
        id: order.id,
        status: "stl",
        action: 'update',
        onSuccess: this.save.bind(this, "stl")

      }
    })

    // setMain('orders__details', {
    //   item: {
    //     action: 'manyEdit',
    //     filter: {
    //       fired_time__isnull: true,
    //       deleted: false,
    //       order
    //     },
    //     onSuccess: this.printKitchen,
    //     data: {
    //       fired_time: new Date()
    //     }
    //   }
    // })
    // setMain("orders__main", { active: '' })
    // history.push(`/call_center`)
  }
  cancelOrder = () => {

    const { order, setMain } = this.props
    setMain('orders__main', {
      item: {
        id: order.id,
        status: 'can',
        end_time: new Date(),
        action: 'update',
        onSuccess: this.save.bind(this, "can")

      }
    })

  }
  save=(status)=> {
    const popup = {
        type: 'Save', visable: true, width: "50%",
        childProps: {
            msg: status=='can'? "The Order is Canceled" : "The Order is Sended to location"

        }
    }
    // history.push(get(urls, mode.key))
    return [{
        type: 'set_main_popup',
        data: { popup }
    },{
      type: 'set_main_orders__main',
      data: {active: ''}
    }]
}
  render() {
    return <div style={{ display: 'flex' }}>
      {map(actions, (d, key) => (
        <button type="button" key={key} className={styles.actions} onClick={this.takeAction.bind(this, d)} >
          <FontAwesomeIcon icon={d.icon} /></button>
      ))}
    </div>
  }


}
const mapStateToProps = (state, props) => ({
  order: get(state.orders__main.data, props.order.id)
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewComponent))