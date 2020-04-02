import React, { Component } from 'react'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get,min} from 'lodash';
import applyFilters from 'helpers/functions/filters';
class MainItems extends Component {
 

    renderItems=()=>{
        const {category} = this.props;
        const items = applyFilters({
          key: 'Filter',
          path: 'items__sales_items',
          params: {
              base_sales_cat:category
          }
      })
  
      return items.map((d,v)=>{
         console.log(this.getPrice(d.id))

      })
        
      }
      
      getPrice(item){
        const list = applyFilters({
            key: 'List',
            path: "items__prices",
            select: {
                sales_item:item
            }
          })
          
         const price= []
         list.map(d=>price.push(d.price))

      return min(price)
    }

    render() {
        return (
        this.props.category?<div>
            {this.renderItems()}
           </div>
           :<></>
        )
    }
}
const mapStateToProps = state => ({
    category: get(state.items__base_sales_cat,'active',undefined)
})
    
export default connect(mapStateToProps,mapDispatchToProps)(MainItems);
