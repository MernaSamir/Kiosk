import React, {Component} from 'react'
import Header from './header'
import Footer from './footer'
import Details from './details'
import classes from './style.less'

class Check extends Component {

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('iam in should ')
    //     const compare = ['receipt'];
    //     return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    // }
    render() {
        const { seat , order, setAll, receipt} = this.props
       
        return (
            <div className={classes.check}>
                <Header seat={seat} order={order}/>
                <Details seat={seat} receipt={receipt}/>
                <Footer seat={seat} order={order} setAll={setAll} receipt={receipt}/>  
            </div>
        )
    }
}


export default Check
