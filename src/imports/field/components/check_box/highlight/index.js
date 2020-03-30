import React, { Component } from 'react';
import styles from './style.less';
import { withTranslation } from 'react-i18next';

class CheckBoxHighlight extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);
    }
    onClick = () => {
        const { onClick = () => { }, field } = this.props
        if (!field.value) {
            onClick()
        }
    }

    render() {
        const { labeling, field, t, disabled } = this.props;
        return (
                <label onClick={this.onClick} className={styles.checkbox}>
                    <input {...field} type="checkbox" checked={field.value} disabled={disabled} />
                    <p>{t(labeling)}</p>
                </label>
        );
    }
}

export default withTranslation()(CheckBoxHighlight)
