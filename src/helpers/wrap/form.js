import React from 'react';
import {Formik, Form} from 'formik'
import {pick} from 'lodash'
export default (Component, props={})=>{
    return class FormComponent extends React.Component{
        
        // shouldComponentUpdate(nextProps, nextState) {
        //    const compare = ['initialValues', 'item'];
        //    return !isEqual(pick(this.props, compare), pick(nextProps, compare))
        // }
        render(){
            const {initialValues} = this.props;
            const {onSubmit=Component.onSubmit} = props;
            return <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={onSubmit.bind(Component, this.props)}>
                {(props)=>(
                    <Form onSubmit={props.handleSubmit}>
                        <Component {...{...pick(props, ['handleSubmit','resetForm', 'setValues', 'handleChange','values', 'isValid']), ...this.props}} />
                        <button type="submit" style={{position: 'absolute', visibility: 'hidden'}}></button>
                    </Form>
                )}
            </Formik>

        }
    }
}
