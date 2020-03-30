import React, { Component } from 'react'
import Pagination from './pagination';
import Actions from './actions/index'
import classes from './style.less'
import MoveItem from './move_item';
import applyFilters from 'helpers/functions/filters'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import { get } from 'lodash';

 class Header extends Component {
    pagination =() =>{
        const {match, filters} = this.props
        if (match.url.includes('search')) {
           
            const list = applyFilters({
                key:'Search',
                path:'items__sales_items',
                params:{
                    name: filters
                }
            })
            return <Pagination data= {list} search={true} max={25}/>
        }
        else 
            return <Pagination />
    }
    render() {
        const { option } = this.props
        return (
            <div className={classes.buttons_menu_div}>
                <Actions />
                {option && <MoveItem />}
                {this.pagination()}
            </div>
        )
    }
}
const mapStateToProps = state=>({
    filters: get(state, 'main.search', '')
})
export default connect(mapStateToProps)(withRouter(Header)) 