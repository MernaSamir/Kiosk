import React, { Component } from 'react'
import { Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormControls from 'form_control'
import { withTranslation } from 'react-i18next';

export class popover extends Component {

    state = {
        visible: false,
    };

    renderButton = () => {
        const { icon, label, t } = this.props
        if (icon) {
            return <FontAwesomeIcon type="primary" icon={icon} />
        }
        return <div>{t(label)}</div>
    }

    renderContent = () => {
        const { content = {} } = this.props
        return <div>
            <FormControls
                {...content}
            />
        </div>
    }
    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleVisibleChange = visible => {
        this.setState({ visible });
    };


    render() {
        const {t} = this.props
        return (
            <Popover
                content={this.renderContent()}
                title={t("Title")}
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
            >
                {this.renderButton()}
            </Popover>
        )
    }
}

export default withTranslation()(popover)