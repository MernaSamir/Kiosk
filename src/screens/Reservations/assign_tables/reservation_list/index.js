import React, {Component} from 'react'
import classes from './styles.less';
import Header from './header';
import List from './list'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
 class AssignTables extends Component {  
     goBack=()=>{
        
        const {history, setMain}= this.props
            const popup = {
                type: 'Save', visable: true, width: "50%",
                childProps: {
                    msg: 'Assignments Completed',
    
                }
            }
            setMain('popup', { popup })
            history.goBack()
     }  
    render() {
        const s = ["Save", "Exit"]
        return (
            <div className={classes.container}>
               <div className={classes.third}><Header  /></div> 
                <List />
                <div className={classes.saveBtns}>
                    {/* <button >Assign Table</button> */}
                    <button type='button' onClick={this.goBack}>{s.join(" & ")}</button>
         </div>
            </div>
        )
    }
}


export default withRouter(connect(null, mapDispatchToProps)(AssignTables))