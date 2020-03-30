import React, { Component } from 'react'
import { Items } from '../buttons';
import Cats from './cats'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less';

class MenuItemClass extends Component {

    constructor(props) {
        super(props);
    }
    onSelect = (index, ev) => {
        const { setMain } = this.props;
        const ele = ev.target.getBoundingClientRect()
        setMain('popup', { position: { left: ele.x || ele.right, top: ele.y || ele.bottom }, index })
    }
    renderList() {
        const { notSticky, option, height  } = this.props
        let tmpheight
        if (notSticky) {
            tmpheight = '72%'
        }
        return (
            <Items {...{ height, notSticky, tmpheight }}
                key='base_sales_cat' className={classes.cat_popup} onSelect={this.onSelect}
                  option={option} />
        )
    }


    renderCatList() {
        return <Cats />
    }

    render() {
        return <>
            {this.renderCatList()}
            {this.renderList()}
        </>

    }
}

export default connect(null, mapDispatchToProps)(MenuItemClass)
