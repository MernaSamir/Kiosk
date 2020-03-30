import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { Input } from 'antd'
import { get } from 'lodash';
import { withTranslation } from 'react-i18next';



export class textbox_relative_ extends Component {
    state = {
        isValid: true
    }
    render() {
        const { field, placeholder, disabled, t } = this.props
        return (
            <Input
                {...field}
                placeholder={t(placeholder)}
                style={{ fontSize: '1vw', display: 'flex' ,width: '100%'}}
                disabled={disabled}

            />
          
        )
    }

}


const mapStateToProps = (state, ownProps) => ({

    relative: get(state, `${ownProps.reduxName}` , {})
})




export const textbox_relative = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(textbox_relative_))
export default textbox_relative
