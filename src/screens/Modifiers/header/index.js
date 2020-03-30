import React, { Component } from 'react'
// import Back_Button from 'components/Back_Button'
import { withRouter } from 'react-router-dom'
import classes from '../styles.less'

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
        const { itemName } = this.props
        return (
            <div className={classes.Mod_top}>
                {/* <Back_Button marginLeft="0" alignSelf="center" onClick={this.backBtn} /> */}
                <div className={classes.Mod_title}>{`${itemName} Modifiers`}</div>
            </div>
        )
    }
}

export default withRouter(Header)
