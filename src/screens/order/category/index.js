import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import Table from '../../../assets/images/003-serving-dish@3x.png';
import {get} from 'lodash'
class Category extends Component {


    getData=()=>{
           const items = applyFilters({
               key: 'Filter',
               path: 'items__custom_menu.data',
               params: {
                   active:true
               }
           })
           const sub_cat = applyFilters({
            key: 'Includes',
            path: "items__base_sales_cat",
            select: 'custom_menu',
        }, undefined, undefined, {data: items.map(d=>d.id)})

        return sub_cat;

    }
    selectItem=(item)=>{
        const {setMain}=this.props;
        setMain('items__base_sales_cat',{active:item.id})

    }

     renderItems=()=>{
       const {category} =this.props;
       const items= this.getData()
            return items.map((d,v)=>{
                return(
                    <button key={v} className={d.id===category?classes.itemActive:classes.buttonContainer} onClick={()=>this.selectItem(d)}>
                    <div className={classes.button}>
                        <img src={Table} className={classes.pic}/>
                    </div>
                    <div className={d.id===category? classes.titleActive : classes.title }>{d.name}</div>
                    </button>
                        
                )
            })
     }
    render() {
        
        return (
           
           <div className={classes.container}>
               {this.renderItems()}
           </div>
        )
    }
}

const mapStateToProps = state => ({
    category: get(state.items__base_sales_cat, "active", undefined),
});
  
  export default connect(mapStateToProps,mapDispatchToProps)(Category);

