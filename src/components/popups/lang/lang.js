import React, { Component } from 'react'
import classes from './style.less'
import { map } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main';
import { connect } from 'react-redux';
import applyFilters from 'helpers/functions/filters'

class Courses extends Component {

    handleClick = (lang) => {
        const { setAll } = this.props;
        setAll([
            {type: "set_main_dropdowns__lang", data: {active: lang.id}},
            {type: "set_main_popup", data: {popup: {}}}
        ])

    }
    renderLang = (active) => {
        return map(this.list, (lang, key) => (
            <button className={active==lang.id && 'active'} key={key} onClick={this.handleClick.bind(this, lang)}>{lang.name}</button>
        ))
    }

    render() {
        const {active} = this.props
        this.list = applyFilters({ path: 'dropdowns__lang.data' })
        return (
            <div className={classes.courseBtns}>
                {this.renderLang(active)}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    active: state.dropdowns__lang.active
})
export default connect(mapStateToProps, mapDispatchToProps)(Courses)
