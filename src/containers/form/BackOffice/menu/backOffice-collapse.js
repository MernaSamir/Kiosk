import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom';
import Sub from './sub'
import menuStyle from './menu_style.less'
import { map } from 'lodash'
class BackOfficeCollapse extends Component {
    state = {
        display: 'none',
        classname: menuStyle.BOMenuDiv,
    }

    openCollapse = () => {
        const { history, element } = this.props
        if (element.data) {
            if (this.state.display == 'none') {
                this.setState({
                    display: 'block',
                    classname: menuStyle.BOMenuDiv_selected
                })
            }
            else {
                this.setState({
                    display: 'none',
                    classname: menuStyle.BOMenuDiv
                })
            }
        }
        else {
            history.push(element.path)
        }
    }

    selectedAppMenuCollapse = () => {
        this.setState({
            display: 'block',
            classname: menuStyle.BOMenuDiv_selected
        })
    }


    submenuListLoop = () => {
        const { element, Nav_location } = this.props
        return map((element.data), (eSub, index) =>
            <Sub index={1}
                key={index}
                eSub={eSub}
                paddLeft='10%'
                selectedAppMenuCollapse={this.selectedAppMenuCollapse}
                Nav_location={[...Nav_location, element.name]} />)

    }
    render() {

        const { classname, display } = this.state
        const { element } = this.props

        return (
            <div>
                <div className={classname}
                    onClick={() => this.openCollapse()} >
                    <FontAwesomeIcon className={menuStyle.backoffice_icon} icon={element.iconName} />
                    <p style={{ whiteSpace: 'nowrap', color: this.state.color, margin: '0', marginRight: '10%' }}>
                        {element.name}
                    </p>
                    <FontAwesomeIcon className={menuStyle.Caret_icon} icon='chevron-down'
                        style={{ color: this.state.color }} />
                </div>
                <div className={menuStyle.subMenuBorder} style={{ display: display }}>
                    {this.submenuListLoop()}
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

const wrapper = connect(mapStateToProps, mapDispatchToProps)(BackOfficeCollapse)
export default withRouter(wrapper)