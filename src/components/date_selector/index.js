import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment'
import {connect} from 'react-redux'
import { DatePicker } from 'antd';
import classes from './styles.less'
import mapDispatchToProps from 'helpers/actions/main'
import {get} from 'lodash'

 class DatePicker_ extends Component {
    onChange=(date)=>{
        const {setMain , reduxName} = this.props 
        setMain(reduxName, {selectedDate: date} )
       }
       subDay=()=>{
     
         const {selectedDate={}, setMain, reduxName} = this.props 
         setMain(reduxName, {selectedDate:  moment(selectedDate).subtract(1, 'day')} )
       }
      addDay=()=>{
         const {selectedDate={}, setMain , reduxName} = this.props 
         setMain(reduxName, {selectedDate:  moment(selectedDate).add(1, 'day')} )
       }
    render() {
        const {selectedDate=moment(), className=classes.Datepicker, Icon="caret"} = this.props;
        return (
            <div className={className}>

                <button  onClick={this.subDay}>
                    <FontAwesomeIcon icon={`${Icon}-left`}  size= 'lg'  />
                </button>
                <DatePicker 
                onChange={this.onChange} 
                value={moment(selectedDate)} 
                allowClear= {false}
                className={classes.picker} format="DD MMMM YYYY" />
                <button onClick={this.addDay}>
                    <FontAwesomeIcon icon={`${Icon}-right`}  size= 'lg' />
                </button>
            </div>
        )
    }
}
const mapStateToProps = (state, props)=>({
    selectedDate: get(state,`${props.reduxName}.selectedDate`)
    
  })
  export default connect(mapStateToProps, mapDispatchToProps)(DatePicker_)
  