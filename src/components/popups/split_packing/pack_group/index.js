import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import { map, get } from 'lodash'
import PackItem from './pack_item'

class PackGroup extends Component {


    renderItems = () => {
        const { elements, setMain } = this.props
        return map(elements, (item, i) => {
            return <PackItem key={i} pack_id={item.id} {...item}
                list={elements}
                setMain={setMain} />
        })
    }

    render() {
        return (
            <div className={classes.packgroup_container}>
                {this.renderItems()}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    courses: get(state.dropdowns__courses, 'data', {})
})

export default connect(mapStateToProps, mapDispatchToProps)(PackGroup)