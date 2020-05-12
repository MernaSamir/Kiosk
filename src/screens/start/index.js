import React, { Component } from "react";
import Image from "assets/images/x.png";
import classes from "./style.less";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import applyFilters from 'helpers/functions/filters'
class Start extends Component {

  constructor(props){
    super(props);
    props.setMain('show',{data:false})
    const test = {
      details: [{
        "id": "6acbb2d9-81a6-48c0-9fca-5aa4806509cc",
        "price": 50.0,
        "quantity": 1.0,
        "item_tax_value": 0.0,
        "order": "5b98beab-7b03-458a-be03-a67972b08ccf",
        "item": "f6b5555d-a05f-4c32-b383-2a252de3c3af"
      }],
      order: {
          "id": "5b98beab-7b03-458a-be03-a67972b08ccf",
          "_type": "loc",
          "start_time": "2020-05-12T02:03:27.139000Z",
          "shift": "ea5e6659-2d19-4117-b205-bf11d67900d3",
          "serve": "43d14305-8102-419e-bbb3-c80a7bf6db95",
          "mode": "f67a5567-eb3e-4694-8d4b-c4a65dfc9b2c",
          "sub_mode": "8c428b14-5e81-4504-b4de-a79598a6773d",
          "station": "ff0f2684-c471-4fbd-af79-babfeff45d64",
        }
    }
    setTimeout(()=>{
      const calc = applyFilters({
        order: test.order,
        key: 'calculateOrderReceipt'
      }, test.details)
      console.log(calc)
    }, 20000)
  }
  handelstart = () => {
    const { history } = this.props;
    history.push("/setting");
  };
  componentWillUnmount(){
    const {setMain} =this.props;
    setMain('show',{data:true})
  }

  render() {
    return (
      <div onClick={this.handelstart} className={classes.container}>
        <div className={classes.logo}>
          <img className={classes.logo_img} src={Image} />
        </div>
        <div className={classes.Text}>
          <p>Touch To Start</p>
        </div>
      </div>
    );
  }
}
export default connect(null,mapDispatchToProps)(Start);
