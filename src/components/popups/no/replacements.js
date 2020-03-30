import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters';
import { find, map } from 'lodash';


class Replacements extends Component {
    
    repalcements = () =>{
        const {detail, Render} =  this.props
        let recipe = applyFilters({
            key:'Filter', 
            path:'items__recipe',
            params:{
                sales_item: detail.item,
            }
        })
        recipe = map(recipe, d=> {
            const stock = applyFilters({path:`stock__items.data.${d.stock_item}`})
            return {...d, name:stock.name}
        })   
        let alters = applyFilters({
            key: 'Includes',
            path:'items__recipe_alter', 
            pick: 'id',
            select: 'recipe'
        },  undefined, undefined, {data: recipe})
       
         alters =  map(alters, d=> {
            const stock = applyFilters({path:`stock__items.data.${d.stock_item}`})
            return {...d, name:stock.name}
        })
        const replacements = applyFilters({
            key:'Filter',
            path:'orders__recipe_removals',
            params:{
                detail:detail.id,
                _type:'rc'
            }
        })
        const initValue = map(replacements, d=>{
           const item = find(recipe, {stock_item: d.stock_item})
           const alter = find(alters, {recipe:item.id, stock_item:d.replaced})
            return {main:item.id, alter: alter.id, id: d.id}
        })
        console.log('initiaaal ', initValue)
        return Render([{
            name: "repalcements",
            type: 'Alters',
            options: recipe,
            alters: alters,
            alterKey:'recipe',
            initValue
        }])

    }
    

    render() {
        
        return (
            
               <div>
                   <p>Replace</p>
                {this.repalcements()}
               </div>
              
              
               
           
        )
    }
}




export default Replacements 
