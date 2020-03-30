import React, { Component } from 'react'
import classes from './style.less'
import Lang from './lang'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'

class LangPopup extends Component {
    render() {
        return (
            <>
                <div className={classes.coursesPopup}>
                    <label className={classes.popupHeader}>Change Language</label>
                </div>
                <Lang onCancel={this.props.onCancel} />
            </>
        )
    }
}
export default connect(null,mapDispatchToProps)(LangPopup)

