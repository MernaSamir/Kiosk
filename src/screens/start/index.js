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
          "shift": "e4e0589c-8a75-4433-9a68-1ff4d2f62248",
          // "serve": "43d14305-8102-419e-bbb3-c80a7bf6db95",
          "mode": "74e2af79-c3d6-45fa-9a8e-45dfcda352c1",
          "sub_mode": "12f93e62-c452-4cc2-b0bf-6024a0f08590",
          "station": "4926a79a-0d23-472b-9f13-0a9f4f5e087e",
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
    history.push("/language");
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
