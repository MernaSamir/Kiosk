import React, { Component } from 'react'
import { Menu, Dropdown } from 'antd'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mapDispatchToProps from 'helpers/actions/main'
import moment from 'moment'
import style from './style.less'
import classes from './style.less'

class dropdown extends Component {

  selectDate = (selected) => {
    const { setMain } = this.props
    if (selected.key !== 'custom') {
      setMain('orders__main', {filters:""})
      let options = {
        'today': { start: moment().subtract(1, 'day'), end: moment() },
        'yesterday': { start: moment().subtract(2, 'day'), end: moment().subtract(1, 'day') }
      }
      let dateList = get(options, selected.key, {})
      setMain("orders__main", { filter: { 'date': dateList } })
      setMain('orders__receipt', {active:''})
    }
    else { 
      setMain('orders__main', {filters:""})
      this.openPopup() }
  }



  openPopup = () => {
    const { setMain } = this.props
    const popup = {
      type: 'DatePickerPopup', visable: true, width: "50%",
    }
    setMain('popup', { popup })
  }

  menu = (
    <Menu onClick={this.selectDate}>
      <Menu.Item key='today'>Today</Menu.Item>
      <Menu.Item key='yesterday'>Yesterday</Menu.Item>
      <Menu.Item key='custom' onClick={this.openPopup}>Custom Date</Menu.Item>
    </Menu>
  );
  render() {

    return (
      <Dropdown overlay={this.menu} trigger={['click']}>
        <button className={classes.button}>
          <FontAwesomeIcon icon="clock" className={style.icon}/>
        </button>
      </Dropdown>
    )
  }
}


const mapStateToProps = (state, props) => ({

})



export default connect(mapStateToProps, mapDispatchToProps)(dropdown)
