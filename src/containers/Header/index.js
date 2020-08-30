import React, { Component } from 'react'
import classes from './style.less'
import Logo from './logo'
import Busniss_day from "./buttons/Business_day_shift"
import userLogo from 'assets/images/minlogo.png'


class Header extends Component {

 
  constructor(props) {
    super(props)
  }

  render() {
   
      return (
        <div className={classes.myContainer}>
          <p className={classes.Text}>Powerd by</p>
          <div className={classes.logo}>
          <Logo />
          </div>
          <userLogo/>
        </div>
      )
    
   
  }
}

export default Header;
