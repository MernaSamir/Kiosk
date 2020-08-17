import React, { Component } from 'react'
import { connect } from 'react-redux'
import classes from './style.less'
import { get, map, isEmpty } from 'lodash'
import applyFilters from 'helpers/functions/filters';

class Combo extends Component {
    constructor(props) {
        super(props);
    }
    renderComponents = () => {
        const { setActive, active, getInfo, list } = this.props
        let info = {}

        return <div className={classes.buttonContainer} >
            {map(list, (l, key) => {
                let ac =!isEmpty(active)?active.id:list[0].id
                info = getInfo(l, 'item')
                return <button className={`${classes.title} ${(ac== l.id)&& classes.active}`} type='button' key={key}
                    onClick={() => setActive(l)}>
                    <p>{l.name}</p>
               { l.price_variance>0?<p>{`+ ${l.price_variance}`}</p>:<p>0 Charge</p>}

                    {/* <p>{`${info.size}`}</p>
                    <p>{`Q: ${l.quantity}`}</p> */}
                </button>
            })}
        </div>
    }
    render() {
        return (
            <div className={classes.container}>
                {this.renderComponents()}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    activePrice: get(get(state.items__prices, 'data', ''), state.items__prices.active, ''),

    details: get(state.form_actions, 'details', {}),

})

export default connect(mapStateToProps, null)(Combo)
