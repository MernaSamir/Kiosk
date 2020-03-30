import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import classes from './style.less'

class Start extends Component {
 
 handelstart =()=>{
    const { history } = this.props;
    history.push('/setting')
}

    render() {
        return (
            <div onClick={this.handelstart} className={classes.container}>

                <div className={classes.logo}>
                    <img className={classes.logo_img} src={Image} />
                </div>
                <div className={classes.Text}>              
                  <p >Toutch To Start</p>
                 </div>
            </div>
        )
    }
}
export default Start;

