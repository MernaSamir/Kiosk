import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mapDispatchToProps from 'helpers/actions/main'
import style from './style.less'
import { get } from 'lodash'


export class index extends Component {

    handleListCollapse = () => {
        const { setMain, listCollapsed } = this.props
        setMain('application_settings', { 'listCollapsed': !listCollapsed })
    }

    renderButton = () => {
        const { listCollapsed } = this.props
        if (!listCollapsed) {
            return <button type="button" className={style.button} onClick={this.handleListCollapse}>
                <FontAwesomeIcon icon="chevron-left" className={style.back_icon} />
            </button>
        } else {
            return <button type="button" className={style.button_collapsed} onClick={this.handleListCollapse}>
                <FontAwesomeIcon icon="chevron-right" className={style.back_icon} />
            </button>
        }
    }

    renderTitle() {
        const { listCollapsed, app } = this.props
        if (!listCollapsed) {
            return <p className={style.list_table_header}>{app.name}</p>
        }
    }
    renderMoreButton() {
        const { listCollapsed } = this.props
        if (!listCollapsed) {
            return <div className={style.more_icon_div}>
                <FontAwesomeIcon icon="ellipsis-v" className={style.more_icon} />
            </div>
        }
    }

    render() {
        return (
            <div className={style.title}>
                {this.renderButton()}
                {this.renderTitle()}
                {this.renderMoreButton()}
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    app: get(state, 'apps.active', ''),
    listCollapsed: get(state.application_settings, 'listCollapsed', '')
})

export default connect(mapStateToProps, mapDispatchToProps)(index)
