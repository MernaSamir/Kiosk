import React, { Component } from 'react'
import classes from './style.less'
import { withTranslation } from 'react-i18next'


export class DisplayText extends Component {

    render() {
        const { label, fontSize, align, style, t } = this.props
        const styleFont = {
            fontSize: fontSize ? fontSize : '1vw',
            justifyContent: align ? align : 'center',
            ...style
        }
        return (
            <div>
                <span className={classes.text} style={styleFont}>{t(label)}</span>
            </div>

        )
    }

}
export default withTranslation()(DisplayText);
