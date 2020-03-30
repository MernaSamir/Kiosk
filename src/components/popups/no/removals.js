import React, { Component } from 'react'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import {map } from 'lodash';


class Removals extends Component {
    
    renderRemovableItem = () => {
        const {detail, Render} = this.props
        const recipe = applyFilters({
            key:'Filter', 
            path:'items__recipe',
            params:{
                sales_item: detail.item,
                removable: true
            }
        })
        const stocks  =  applyFilters({
            key: 'picking',
            reduxName:'stock__items', 
            select: 'stock_item'
        }, recipe)
        const removals = applyFilters({
            key:'Filter',
            path:'orders__recipe_removals',
            params:{
                detail:detail.id,
                _type:'rm'
            }
        })
       

        
        return Render([{
            name: "items",
            type: 'MultiSelectRemoved',
            className: classes.btnsContanier,
            options: stocks,
            initValue: map(removals, i=>({stock_item:i.stock_item, id:i.id}))

        }])
       
    }
    

    render() {
        
        return (
            
                this.renderRemovableItem()
              
              
               
           
        )
    }
}




export default Removals 
