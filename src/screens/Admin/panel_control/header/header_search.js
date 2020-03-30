import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './../style.less'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
class HeaderSearch extends Component {

  openPopup=()=>{
      const {setMain} =  this.props
      const popup = {type: 'Search',
      childProps: {
          title: "Order Note",
          onClick: this.search,
      }}
      setMain('popup',{popup})

  
  }
  search=(input)=>{
    const{setMain} = this.props
    setMain('main', {search:input})
  }
  render() {
    return (
      
        <button type="button" className={classes.search_btn} onClick={this.openPopup}>
          <FontAwesomeIcon icon="search" />
        </button>

    )
  }
}
export default connect(null, mapDispatchToProps)(HeaderSearch)