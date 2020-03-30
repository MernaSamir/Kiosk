import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
// import { withRouter } from 'react-router-dom'
import {  map } from 'lodash'

 class Group extends Component {

    getFilter(d){
        const {setMain} = this.props
        setMain('dropdowns__delivery_group', {select:d})
         
    }

    renderBtns = () => {
  const {groups, select} = this.props
        return <div className={ classes.btns}>
            <button  className={select=='All'&& 'active'}type="button" onClick={this.getFilter.bind(this ,'All')}>All</button>
            {map(groups, (d, i) => {
               return <button type="button"  className={select==String(i)&& 'active'}
               onClick={this.getFilter.bind(this ,String(i))}>{i + 1}</button>
            })}
        </div>
    }

    render() {
        return (
            <div className={classes.group}>
                <p>Group</p>
                {this.renderBtns()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    select: state.dropdowns__delivery_group.select
})

export default connect(mapStateToProps,mapDispatchToProps)(Group)