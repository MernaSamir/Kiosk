import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get } from 'lodash'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import { message } from 'antd';

class Card extends Component {
    delivery_boys = []

    renderHeader = () => {
        const { title } = this.props
        return <div className={classes.header}>
            <p>{`${title}`}</p>
        </div>
    }

    renderTable = () => {
        return <div className={classes.table}>
            <table onClick={this.move}>
                <thead>{this.renderThead()}</thead>
                <tbody>{this.renderTbody()}</tbody>
            </table>
        </div>
    }

    renderThead = () => {
        return <tr>
            {/* <th className={classes.first_t}>ID</th> */}
            <th className={classes.second_t}>Name</th>
        </tr>
    }
    activeDeliveryBoy = (d) => {
        const { setMain, assign } = this.props
        { (assign) ?setMain("auths__user", { active: d.id }):   
              message.warning("Please active the Assignation")

     }
    }
    moveHere = (group) => {
        const { active_boy, setMain } = this.props
        setMain('auths__user', {
            item: {
                id: active_boy.id,
                delivery_group_id: group.id,
                action: 'update',
                onSuccess(){
                    return [{
                      type: 'set_main_auths__user',
                      data: {active:''}
                    }]
                  }                 
            }
        })
    }
    getDeliveryBoys(){
     const {group} = this.props
            group ? 
            this.delivery_boys = applyFilters({
                key: 'Filter',
                path: "auths__user",
                params: {
                    delivery_group_id: group.id,
                    is_delivery: true
                }
            })
                : 
                this.delivery_boys = applyFilters({
                    key: 'Filter',
                    path: "auths__user",
                    params: {
                        delivery_group_id: null,
                        is_delivery: true
                    }
                })
        }

    renderTbody = () => {
        const { group, assign, active_boy } = this.props
        const allow_move = (assign && active_boy && (group)) && !(active_boy.delivery_group_id == group.id)
        this.getDeliveryBoys()
        return <>
            {allow_move &&
                <tr className={classes.move} onClick={this.moveHere.bind(this, group)}> Move Here</tr>}
            {map(this.delivery_boys, db => (
                <tr onClick={this.activeDeliveryBoy.bind(this, db)}>
                    <td className={active_boy.id == db.id ? (classes.second_t && 'active') : classes.second_t}>{db.name}</td>
                </tr>

            ))}
        </>
    }

    render() {
        return (
            <div className={classes.card_container}>
                {this.renderHeader()}
                {this.renderTable()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    assign: state.dropdowns__delivery_group.assign,
    active_boy: get(state.auths__user.data, state.auths__user.active, false)

})

export default connect(mapStateToProps, mapDispatchToProps)(Card)