import React, {Component} from 'react'
import classes from './style.less'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'

 class Actions extends  Component{

    cancelAdd =()=>{
        const {  setMain } = this.props
        setMain('popup',{popup:{}})
    }
    Cancel = () => {
        const { setMain } = this.props
        const popup = {
            type: 'CancelCustomer', visable: true, width: "50%",
            childProps: {
                Title: 'Cancel Menu',
                first_msg : 'Are you sure you want to Cancel Menu?',
                second_msg :'All unsaved data will be lost', 
                pressYes : this.cancelAdd
              }
        }
        setMain('popup', { popup })
    }

    cancel = () => {
        this.Cancel()

    }
    

  render() {
    return (
    <div className={classes.button}>
        <button type="button" onClick={() => this.cancel()}>Cancel</button>
        <button type="submit" >Done</button>
    </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(withRouter(Actions))
