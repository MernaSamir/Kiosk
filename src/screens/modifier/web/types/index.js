import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
class Types extends Component {



    render() {
        const {setActive , active, stocks , removals}= this.props
        return (
           
           <div className={classes.container}>
                <div className={classes.buttonContainer} >
                    <button type='button' className={`${classes.title} ${active == 'Extra' && classes.active}`}
                     onClick={()=>setActive('Extra')}>Extra</button>
                     {(stocks) &&
                    <button type='button' className={`${classes.title} ${active == 'NO' && classes.active}`}
                    // onClick={()=>setActive('No')}
                    >No</button>}
                 </div>           
            </div>
        )
    }
}
export default connect(null,mapDispatchToProps)(Types);

