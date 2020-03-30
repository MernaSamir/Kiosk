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
            <button>
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
            <p>Select Language</p>
            <div>
            <button>English</button>
            <button>العربيه</button>
            </div>
        </div>
        )
    }
}
export default Start;

