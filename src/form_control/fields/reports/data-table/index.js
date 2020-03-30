import React, { Component } from 'react'
import './style.css'
import axios from 'axios'
import moment from 'moment';
const dateFormat = 'DD MMM YYYY';
import {getReportData , setReportMain, getReportMainData} from "../../../store/actions/report-actions"
import { connect } from 'react-redux'
import {map }from 'lodash'
const objectgouda = {
    "groupby":"id",
    "filter": [{
        "field": "shift__date__date",
        "eq": "lt",
        "val": "2019-10-01"
        
    }, {
        "field": "refunded_time",
        "eq": "gt",
        "val": "false"
        
    }],
    "eval":[{
    "field":"sales",
    "alias": "test",
    "fun": "sum",
    "eq": "price"*"quantity",
    "group": "sales_item"
    }]
    }
const objdata = {
    "groupby":"location",
    "eval":[{
    "field":"sales",
    "alias": "test",
    "fun": "avg",
    "eq": "price"*"quantity",
    "group": "sales_item"
    }]


}


 class DataTables extends Component {
     
    
    
    componentDidMount() {
        this.props.getReportData(this.props.url)
       
    }

    createMainHeadTable = () => {
        return this.props.head.map((x, index) => <th colSpan={x.subcol.length} key={index}>  {x.col} </th>)
    }
    creatSubHeadTable = () => {
        return this.props.head.map((x, index) => x.subcol.map(y => <th key={index}> {y}</th>))

    }
    
    creatTableobject =()=>{
        const {fakedataobject, head}= this.props;
        
        let result =   map(fakedataobject,w=> map(head,x=> map(w[x.data] ,y=> <td> {y}</td>)  )  )   
        return result 
        
    }






    render() {

       console.log (this.creatTableobject())
        return (
        
        
            <div>
                
                <table className="reporttable">
                    <tr>
                        {this.createMainHeadTable()}
                    </tr>
                    <tr>

                        {this.creatSubHeadTable()}
                    </tr>
                    
                    {this.creatTableobject()}
                </table>
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
  getReportData,
  setReportMain,
    getReportMainData
}

export default connect(mapStateToProps, mapDispatchToProps)(DataTables)

