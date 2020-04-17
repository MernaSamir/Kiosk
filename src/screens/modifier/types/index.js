import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
class Category extends Component {


    render() {
        
        return (
           
           <div className={classes.container}>
                <div className={classes.buttonContainer} >
                    <div className={classes.title}>Extra</div>
                    <div className={classes.title}>No</div>
                 </div>           
            </div>
        )
    }
}
export default connect(null,mapDispatchToProps)(Category);

