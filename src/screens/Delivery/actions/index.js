import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../style.less'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
 class ViewComponent extends Component {
  getSummary = () =>{ 
    const {history , customer={}, setMain} = this.props
    setMain("parties__customer",{active: customer.id})
    history.push('/customer-summary')
  }
  render() {
    return (
        <button type="button" className={styles.actions} onClick={this.getSummary} >
       <FontAwesomeIcon icon={['far', 'user']} /></button>  
    )
  }
}

export default withRouter(connect(null,mapDispatchToProps)( ViewComponent))