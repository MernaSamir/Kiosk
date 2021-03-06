import React, { Component } from 'react'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get} from 'lodash';
import applyFilters from 'helpers/functions/filters';
import Loading from "helpers/components/loading";
import classes from './style.less'
import Table from '../../assets/images/003-serving-dish@3x.png';

class Home extends Component {

    
     selectItem=(item)=>{
     const { history,setMain } = this.props;
     history.push("/order");
     setMain('items__base_sales_cat',{active:item.id})

     }
    
    render() {
        const {chain_name}=this.props
        
        const category = applyFilters({
            key: 'Filter',
            path: 'items__custom_menu.data',
            params: {
                active:true
            }
        })
        //scr image 8alt l7ad mytb3t
        const renderItems=()=>{
           return sub_cat.map((d,v)=>{
               return(
                   <button key={v} className={classes.buttonContainer} onClick={()=>this.selectItem(d)}>
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
        const sub_cat = applyFilters({
            key: 'Includes',
            path: "items__base_sales_cat",
            select: 'custom_menu',
        }, undefined, undefined, {data: category.map(d=>d.id)})


        
        return(
            !chain_name ? <Loading/>
            :<div className={classes.Container}>
           {/* {console.log(refundedItems)} */}
                <div className={classes.space}></div>
              <p className={classes.Text}> Welcome To {chain_name}</p>
              
              <p className={classes.Text}> shwayt klam gai mn database lama yt7at fel database yb2a y7lha rabna </p>
              <div className={classes.btnContainer}>
                  {renderItems()}
              </div>
               
            </div>
            )

    }
}
const mapStateToProps = state => ({
    chain_name: get(
        state.licensing__chain.data,
        get(state, "licensing__chain.active", {}),{}).name
})
export default connect(mapStateToProps,mapDispatchToProps)(Home);

