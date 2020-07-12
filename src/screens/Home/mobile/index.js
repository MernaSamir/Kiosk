import React, { Component } from 'react'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get} from 'lodash';
import applyFilters from 'helpers/functions/filters';
import Loading from "helpers/components/loading";
import classes from './style.less'
import Table from '../../../assets/images/003-serving-dish@3x.png';
import HomeWrap from "helpers/wrap/screens_wraps/home"

class Mobile extends Component {
    renderItems=()=>{
        const {sub_cat, selectItem}= this.props
        return sub_cat.map((d,v)=>{
            return(
                <button key={v} className={classes.buttonContainer} onClick={()=>selectItem(d)}>
                <div className={classes.button}>
                    <img src={Table} className={classes.pic}/>
                </div>
                <div className={classes.title}>
                    <p >
                        {d.name}
                     </p>
                    </div>
                </button>
                    
            )
        })

     }
    render() {
        const {chain, selectItem}=this.props
        // const category = applyFilters({
        //     key: 'Filter',
        //     path: 'items__custom_menu.data',
        //     params: {
        //         active:true
        //     }
        // })
        // //scr image 8alt l7ad mytb3t

        // const sub_cat = applyFilters({
        //     key: 'Includes',
        //     path: "items__base_sales_cat",
        //     select: 'custom_menu',
        // }, undefined, undefined, {data: category.map(d=>d.id)})


        
        return(
            !chain ? <Loading/>
            :<div className={classes.Container}>
           {/* {console.log(refundedItems)} */}
                <div className={classes.space}></div>
              <p className={classes.Text}> Welcome To {chain.name}</p>
              
              <p className={classes.Text}> ayyyyy klam gayyyyyyyyy mn database </p>
              <div className={classes.btnContainer}>
                  {this.renderItems()}
              </div>
               
            </div>
            )

    }
}
// const mapStateToProps = state => ({
//     chain_name: get(
//         state.licensing__chain.data,
//         get(state, "licensing__chain.active", {}),{}).name
// })
export default connect(null,mapDispatchToProps)(HomeWrap(Mobile));

