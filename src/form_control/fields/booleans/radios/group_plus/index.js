import * as React from 'react';
import RepoteBtn from './btn'
import { withTranslation } from 'react-i18next';
export class radioBtn extends React.Component {

    state = {
        currentClicked: ''

    }



    onChange = (value) => {
        const { onChange, name } = this.props
        // alert(name)
        this.setState({ currentClicked: value })
        onChange(value, name)
    }

    renderGroup = () => {
        const { list, t } = this.props
        return (list || []).map((d, index) => {
            return <RepoteBtn
                key={index}
                name={t(d.name)}
                clicked={this.state.currentClicked == d.name}
                onChange={this.onChange}
            />
        })
    }

    render() {
        return (
            <div>
                {this.renderGroup()}
            </div>
        );
    }
}

export default withTranslation()(radioBtn);