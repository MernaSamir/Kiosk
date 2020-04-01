import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {isEmpty} from 'lodash';
import applyFilters from 'helpers/functions/filters';
import Loading from "helpers/components/loading";
import Table from '../../../assets/images/003-serving-dish@3x.png';
class Category extends Component {
 
    render() {

        console.log("here")
        const items = applyFilters({
            key: 'Filter',
            path: 'items__custom_menu.data',
            params: {
                active:true
            }
        })
        
         console.log(items)
        const renderItems=()=>{
                return items.map((d,v)=>{
                    return(
                        <div key={v} className={classes.buttonContainer} onClick={()=>selectItem(d)}>
                        <div className={classes.button}>
                            <img src={Table} className={classes.pic}/>
                        </div>
                        <div className={classes.title}>{d.name}</div>
                        </div>
                            
                    )
                })
         }
        return (
           
           <div className={classes.container}>
               {renderItems()}
           </div>
        )
    }
}
export default connect(null,mapDispatchToProps)(Category);

