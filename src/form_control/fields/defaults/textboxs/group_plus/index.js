import React, { Component } from 'react'
import InputComponent from "helpers/components/input"
//import style from './style.less'
import { map, get, filter } from 'lodash'
import { connect } from 'react-redux'
import { Connect } from "helpers/functions"
import mapDispatchToProps from 'helpers/actions/main'
import Type from './type'



export class AddNewGroup_Comp extends InputComponent {

    state = {

        list: [""]
    }

    handelInputChange = (value, index) => {

        const { field } = this.props

        const { list } = this.state
        let newList = (list || []).map((d, i) => {
            if (i == index) {
                return value
            }
            return d
        })

        //    alert(JSON.stringify(field))
        field.onChange({
            target: {
                name: field.name,
                value: newList
            }
        })

    }

    componentDidUpdate = () => {
        const { contacts } = this.props
        this.onChange(contacts)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const compare = ['activePerson','field.value'];
    //     return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    // }

    renderTypes = () => {
        const { types, field } = this.props

        return map(types, (type, index) => {
            const typeData = filter(field.value, { contact_type: type.id })
            return <Type  type={type} extra={{ 'contact_type': type.id }} typeData={typeData} key={index} />
        })
    }


    render() {
        console.log('group', this.props.field.value)
        return (
            <div>
                {this.renderTypes()}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    apis: get(state, 'apps.api', {}),
    types: get(state, `${ownProps.typesReduxName}.data`, {}),
    get activePerson() { return get(state, `${ownProps.personReduxName}.active`, '') },
    get contacts() { return filter(get(state, `${ownProps.contactsReduxName}.data`), { employee: this.activePerson }) }
})




class text_box_group extends Component {
    Component = <div></div>
    constructor(props) {
        super(props);
        this.getComponent(props)
    }
    getComponent = (props) => {
        const { fetchAll, apis } = this.props
        let typesReduxNameFound = get(apis, `${props.typesReduxName}`, {})
        const app = {
            name: `${typesReduxNameFound.name}`,
            settings: {
                url: typesReduxNameFound.api,
            }
        }

        this.Component = Connect(null, app, AddNewGroup_Comp)

        fetchAll([{
            ...typesReduxNameFound,
            params: {}
        }])
    }
    render() {

        return (
            <AddNewGroup_Comp {...this.props} />
        )
    }
}

export const AddNewGroup = connect(mapStateToProps, mapDispatchToProps)(text_box_group)
export default AddNewGroup
