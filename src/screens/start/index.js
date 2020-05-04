import React, { Component } from "react";
import Image from "assets/images/x.png";
import classes from "./style.less";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
class Start extends Component {

  constructor(props){
    super(props);
    props.setMain('show',{data:false})
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
