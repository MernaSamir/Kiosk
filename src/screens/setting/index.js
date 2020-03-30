import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import ButtonData from './json';
import classes from './style.less'

class Start extends Component {
 
 handelstart =()=>{
    const { history } = this.props;
    history.push('/home')
}
renderButon = ()=>{
    return ButtonData.map((d,v)=>{
        return(
            <button className={classes.btn}>
                {d.title}
                <img src={d.icon}/>
            </button>
        )
    })
}

    render() {
        return (
        <div className={classes.body}>
            <div className={classes.flexContainer}>
                <div className={classes.flexbox}>
                {this.renderButon()}
                </div>
            </div>
            <p className={classes.Text}>Select Language</p>
            <div className={classes.buttonContainer}>
            <button className={classes.button}>English</button>
            <button className={classes.button}>العربيه</button>
            </div>
        </div>
        )
    }
}
export default Start;

