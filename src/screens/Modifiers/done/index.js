import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import Red_Rectangle_Button from "components/Red_Rectangle_Button";
import classes from '../styles.less';

class DoneButton extends Component {

    okBtn = () => {
        const { list=[], history, setMain, back } = this.props

        if (back) {
            back()
            return
        }
        if(list.find(d=>d.reject)){
            return
        }
       
        else{
            setMain("orders__details", { active: '' })
            history.push('/home')
        }
    }

    render() {
        return (
            <div className={classes.ok_div}>
                <Red_Rectangle_Button name="Done" type='button' className={classes.btn} onClick={this.okBtn} />
            </div>
        )
    }
}

export default withRouter(DoneButton)