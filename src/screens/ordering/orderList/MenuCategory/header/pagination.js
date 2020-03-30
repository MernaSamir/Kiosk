import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEqual, isEmpty, filter, keys } from 'lodash';
import { getLengthOfObject } from 'helpers/functions'
import classes from './style.less';

class Pagination extends Component {

    constructor(props) {
        super(props)
        const { setMain, max } = this.props
        this.size = max? max:20
        setMain('page', { active: 1 })
    }

    componentDidUpdate(prevProps, prevState) {
        const { setMain } = this.props
        
        if (!isEqual(prevProps.data, this.props.data)) {
            setMain('page', { active: 1 })
        }
    }

    handelPageClick = (op) => {
        const { active, data = {}, setMain } = this.props
        let maxLength = getLengthOfObject(data) / this.size
        if (!(active <= 1 && op == -1) && !(active >= maxLength && op == 1)) {
            setMain('page', { active: active + op })
        }
    }

    render() {
        const { active, data = {}} = this.props
        let style = {
            opacity: '0.70'
        }
        let maxLength = 1
        if (!isEmpty(data)) {
            let maxItem = getLengthOfObject(data)
            if (maxItem > this.size) {
                 maxLength = (maxItem % this.size) + 1
                //  maxLength = maxItem / this.size
                maxLength=Math.ceil((keys(data) || []).length / this.size)
            }
        }
        if (maxLength > 1) {
            style = {
                opacity: '1'
            }
        }

        return (
            <div style={style} className={classes.pagination_div}>
                <button type="button" className={classes.pagination_btn}
                    onClick={this.handelPageClick.bind(this, -1)}>
                    <FontAwesomeIcon icon="caret-left" size="sm" className={classes.icon} />
                </button>
                <p>{active} of {maxLength}</p>
                <button type="button" className={classes.pagination_btn}
                    onClick={this.handelPageClick.bind(this, 1)}>
                    <FontAwesomeIcon icon="caret-right" size="sm" className={classes.icon} />
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    active: state.page.active,
    subCat: state.items__base_sales_cat.active,
    data:props.search?props.data: filter(state.items__sales_items.list,
        { ...state.items__sales_items.filter, base_sales_cat: state.items__base_sales_cat }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Pagination)