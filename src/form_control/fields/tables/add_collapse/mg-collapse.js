import React, { Component } from 'react'
import mgStyle from './mg-style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withTranslation } from 'react-i18next'
class MGcollapse extends Component {
    state = {
        active: false,
        transform: "rotate(0deg)",
        transitionDuration: ".4s",
    }

    activecollapse = () => {
        if (this.state.active == false) {
            this.setState({
                active: true,
                transform: "rotate(180deg)",
            })
        }
        else {
            this.setState({
                active: false,
                transform: "rotate(0deg)",
            })
        }
    }
    render() {
        const {collapseName, t} = this.props
        return (
            <td className={mgStyle.mgTableTr} onClick={() => this.activecollapse()}>
                <div className={mgStyle.CollapseDiv}>
                    <span>{t(collapseName)}</span>
                    <FontAwesomeIcon icon="chevron-down" className={mgStyle.icon} style={{ transform: this.state.transform, transitionDuration: this.state.transitionDuration }} />
                </div>
            </td>
        )
    }
}

export default withTranslation()(MGcollapse)