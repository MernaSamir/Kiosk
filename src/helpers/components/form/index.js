import React, { Component } from 'react';
import mapDispatchToProps from 'helpers/actions/main';
import {connect} from 'react-redux';
import * as layouts from 'form/layouts/types';
import {get} from 'lodash'
class FormComponent extends Component {
    constructor(props){
        super(props);
        this.setHandleSubmit({ submit: props.handleSubmit, resetForm: props.resetForm })
    }
    setHandleSubmit = (handleSubmit) => {
        const { setMain, layout } = this.props
        setMain('form_actions', { [layout.reduxName]: handleSubmit })
    }
    render(){
        const {layout} = this.props
        const MainComponent = get(layouts, layout.type, () => layout.type)

        return (
            <MainComponent
                fields={layout.fields}
                layoutName={layout.layoutName} />
        )

    }
}


export default connect(null, mapDispatchToProps)(FormComponent);
