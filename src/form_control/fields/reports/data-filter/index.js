import React, { Component } from 'react'
import { Modal, Button, DatePicker, Input, Select, TreeSelect } from 'antd';
import { disabledTime, timePickerElement } from 'rc-calendar/lib/RangeCalendar';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import axios from 'axios'
import { resolve } from 'q'; 
import { setReportMain, getReportMainData } from "./../../../../store/actions/report-actions"
import { connect } from 'react-redux'
// import {groupBy} from 'lodash'
const Option = Select.Option
const dateFormat = 'DD MMM YYYY'

export class Filters extends Component {
  state = {
    open: false,
    visible: false,

  }
  
  componentDidMount() {
    const { getReportMainData, chain , location } = this.props
    // getReportMainData('chain', 'http://127.0.0.1:8000/api/v1/licensing/chain/')
    // getReportMainData('location', 'http://127.0.0.1:8000/api/v1/licensing/location/')
  }

  filtrationData = () => {
    const {  chain , location } = this.props
    
    let data = (chain || []).map(x => ({
      title: x.name,
      value: x.id,
      children: ((location || [])
        .filter(y => x.id == y.chain) || [])
        .map(d => ({ title: d.name, value: `${x.id}-${d.id}` }))
    }))
    return data
  }






  handelSelectchanges = (name, value) => {
    this.props.setReportMain(name, value)

  }

  calendarChange = (value) => {

    this.props.setReportMain('start', value[0])
    this.props.setReportMain('end', value[1])

  }

  handelDateChange = (value, name) => {
    this.props.setReportMain('start', moment().add(value, name).startOf(name))
    this.props.setReportMain('end', moment().add(value, name).endOf(name))
  }



  showModal = () => {
    this.setState({
      visible: true,
    });
    console.log(this.state.visible)
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }




  render() {


    const { start, end } = this.props
    const calendar = <RangeCalendar
      showToday={false}
      showWeekNumber
      dateInputPlaceholder={['start', 'end']}
      showOk={false}
      showClear={true}
      onChange={this.calendarChange}
      disabledTime={disabledTime}
      timePicker={timePickerElement}
      selectedValue={[start, end]}
      format="DD MMM YYYY"
      showDateInput={false}
    />
    return (

      <div id="date-range" className='flex_container_screen noBackground'>

        <div className="flex_container_scond">
          <div className="flex_container_third">

            <h3> Revenue:</h3>
            <Input
              type="primary"
              onClick={this.showModal}
              // value={`${start.format(dateFormat)} - ${end ? end.format(dateFormat) : undefined}`}
              style={{ width: '28vh', fontSize: ".9vw", marginLeft: '2%' }}
            />

            <h3 style={{ marginLeft: '5%' }}> By</h3>
            <Select
              style={{ width: '30vh', fontSize: ".9vw", marginLeft: '2%' }}
              onChange={this.handelSelectchanges.bind(this, 'SelectBy')}
              name='SelectBy'
              value={this.props.SelectBy}
            >

              <Option value='Year'> Year </Option>
              <Option value='Month'> Month </Option>
              <Option value='Day'> Day </Option>

              <Option value='Weekday'> Weekday </Option>
              <Option value='Hour'> Hour </Option>
              <Option value='Chains'> Chains/Locations </Option>
              <Option value='Menus/Groups/Items'> Menus/Groups/Items </Option>

              <Option value='Order Mode'> Order Mode </Option>
              <Option value='Occasion'> Occasion </Option>


            </Select>
            <h3 style={{ marginLeft: '5%' }}> Location</h3>
            <TreeSelect
              style={{ width: '26vh', fontSize: ".9vw", marginLeft: '2%' }}
              value={this.props.SlectLocation}
              // value={(this.state.select || []).value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={this.filtrationData()}
              placeholder="Please select"
              treeDefaultExpandAll
              onChange={this.handelSelectchanges.bind(this, 'SlectLocation')}


              disableCheckbox={true}


            />

          </div>

          <Modal
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width='70%'
          >

            <div className='is-grouped' >
              <Button className='button' onClick={() => this.handelDateChange(0, 'day')} name="Today" > Today </Button>
              <Button className='button' onClick={() => this.handelDateChange(-1, 'day')} name="Yesterday" >Yesterday </Button>
              <Button className='button' onClick={() => this.handelDateChange(0, 'month')} name="This Month" >This Month </Button>
              <Button className='button' onClick={() => this.handelDateChange(-1, 'month')} name="Last Month" > Last Month</Button>
              <Button className='button' onClick={() => this.handelDateChange(0, 'year')} name="This Year" > This Year</Button>
              <Button className='button' onClick={() => this.handelDateChange(-1, 'year')} name="Last Year" > Last Year</Button>
            </div>
            <div className="divid">

              <div>
                {calendar}
              </div>

              <div className='flex-container'>
                <h4> From</h4>
                <DatePicker value={moment(start, dateFormat)} format={dateFormat} />
                <h4> To</h4>
                <DatePicker value={moment(end, dateFormat)} format={dateFormat} />

              </div>
            </div>


          </Modal>






          <div>
            <Button onClick> Export </Button>
            <Button onClick> Print </Button>
          </div>
        </div>

        <div className="tablereportsearch">
          <div className="flex_container_scond">
            <div className='input_DbtnReport'>
              <FontAwesomeIcon className='icon_searchinputReport' icon="search" />
              <input style={{ color: '#bbbbbb' }} placeholder='Search'></input>
              {/* <button>D</button> */}
            </div>
            <Button onClick> Export </Button>
          </div>


        </div>
        {JSON.stringify(this.state.location_list)}

        {/* {JSON.stringify(this.state.list)}  */}



      </div>



    )
  }
}





const mapStateToProps = (state) => ({

  SelectBy: state.Report.SelectBy,
  SlectLocation: state.Report.SlectLocation,

  start: state.Report.start,
  end: state.Report.end,

  chain: state.Report.chain,
  location: state.Report.location

})

const mapDispatchToProps = {
  setReportMain,
  getReportMainData
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters)

