import React, { Component } from 'react'
import form_style from 'styles/form_control.less'
import { connect } from 'react-redux'
import { Connect } from "helpers/functions"
import InputComponent from "helpers/components/input"
import mapDispatchToProps from 'helpers/actions/main'
import { get, isEmpty, isEqual, pick } from 'lodash'

export class _DisplayRelativeValue extends InputComponent {

    componentDidMount() {
        const { value, field, apis, reduxName, params, setMain, fetchAll } = this.props
        let foundReduxName = get(apis, `${reduxName}`, {})
        if (isEmpty(value) && reduxName) {
            setMain(`${foundReduxName.name}`, { name: `${foundReduxName.name}` })

            fetchAll([
                {
                    ...foundReduxName,
                    params: { id: field.value } || params
                },
            ], this.handleChange() )

        }
    }

    handleChange = (fetchValue) => {
        const { field } = this.props
        console.log(`selected ${fetchValue}`);
        const value = fetchValue
        this.onChange(value);
    }

    render() {
        const { value } = this.props
        return (
            <div>
                <span className={form_style.displayText}>{value ? value.name : ''}</span>
            </div>

        )
    }

}
const mapStateToProps = (state, ownProps) => ({
    value: get(state, `${ownProps.reduxName}.data.${ownProps.field.value}`, {}),
    apis: get(state, 'apps.api', {})
})

class dsiplay_connector extends Component {
    Component = <div></div>
    constructor(props) {
        super(props);
        this.getComponent(props)
    }

     shouldComponentUpdate(nextProps, nextState) {
        const compare = ['value'];
        return !isEqual(pick(this.props, compare), pick(nextState, compare))
    }

    getComponent = (props) => {
        const { apis } = this.props
        let foundReduxName = get(apis, `${props.reduxName}`, {})

        const app = {
            name: `${foundReduxName.name}`,
            settings: {
                url: foundReduxName.api,
            }
        }
        this.Component = Connect(null, app, _DisplayRelativeValue)


    }
    render() {

        return (
            <this.Component {...this.props} />
        )
    }
}
export const DisplayRelativeValue = connect(mapStateToProps, mapDispatchToProps)(dsiplay_connector)
export default DisplayRelativeValue;