import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
class Types extends Component {



    render() {
        const {setActive , active}= this.props
        return (
           
           <div className={classes.container}>
                <div className={classes.buttonContainer} >
                    <button type='button' className={`${classes.title} ${active == 'Extra' && classes.active}`}
                     onClick={()=>setActive('Extra')}>Extra</button>
                    <button type='button' className={`${classes.title} ${active == 'No' && classes.active}`}
                    // onClick={()=>setActive('No')}
                    >No</button>
                 </div>           
            </div>
        )
    }
}
export default connect(null,mapDispatchToProps)(Types);

