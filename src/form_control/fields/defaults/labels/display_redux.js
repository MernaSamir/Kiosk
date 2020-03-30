import React, { Component } from 'react'
import style from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilter from 'helpers/functions/filters';
import { get } from 'lodash'
import { withTranslation } from 'react-i18next';

class displayReduxClass extends Component {

    renderValue = () => {
        const { reduxName, field, before = '', id } = this.props
        let relValues = applyFilter({ path: `${reduxName}.data.${id}` })
            || applyFilter({ path: `${reduxName}.data.${field.value}` })
        return `${before} ${get(relValues, 'name', '')}`
    }

    render() {
        const {t} = this.props;
        return (
            <div className={style.display_redux}>
                {t(this.renderValue())}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    id: get(state, `${ownProps.staticValue}`, ''),
})

export const display_redux = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(displayReduxClass))
export default display_redux