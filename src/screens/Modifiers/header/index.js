import React, { Component } from 'react'
// import Back_Button from 'components/Back_Button'
import { withRouter } from 'react-router-dom'
import classes from '../styles.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import {get} from 'lodash'
class Header extends Component {

    backBtn = () => {
        const { history, setMain, list } = this.props
        if (list.find(d => d.reject)) {
            return
        }
        setMain("orders__details", { active: '' })
        history.goBack()
    }

    render() {
        const { item } = this.props
        return (
            <div className={classes.Mod_top}>
                {/* <Back_Button marginLeft="0" alignSelf="center" onClick={this.backBtn} /> */}
        <div className={classes.Mod_title}>{item.name} - {item.unit}</div>
        <div className={classes.Mod_title}>Extra</div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item : get(state.cart,'item',{}) 
})
export default connect(mapStateToProps,mapDispatchToProps)(Header)
