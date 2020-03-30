import React, { Component } from 'react';
import {map, get, isEqual, pick, keys, concat} from 'lodash';
import FormControls from 'form_control'
import mapDispatchToProps from 'helpers/actions/main';
import {connect} from 'react-redux';
import BasicComponent from 'helpers/components/basic'

const mapStateToProps = (state, props)=>({
    formValues: get(state.form, `${props.layout.reduxName}.values`),
})

export default function LayoutMain(WrappedComponent){
    class FormComponent extends Component{
        
        componentDidMount() {
            const {validateForm, resetForm, submitForm} = this.props;
            this.setHandleSubmit({validateForm, resetForm, submitForm})
        }

        compares = {
            form:{
                compare: ['values'],
                action: this.updatingForm
            }
        }
        setHandleSubmit = (handleSubmit) => {
            const { setMain, index } = this.props
            setMain('form_actions', { [index]: handleSubmit })
        }

        

        renderFormField(field){
            const {tabKey, layout={}} = this.props
            const tabs = get(field, 'permission.tabs', null);
            if(tabs && !tabs.includes(tabKey)){
                return <div></div>
            }

            return <FormControls
                {...field}
                layout={layout.reduxName}
                tabKey={tabKey}
            />
        }
        renderForm = (fields) => {
            let filterdFields = fields;
             return map(filterdFields, (d, index) => {
                 return (
                     <section key={index} className="collapse_table_td">
                         {this.renderFormField(d)}
                     </section>
                 )
             })

        };

        updatingForm(nextProps){
            const {values, appendPath, formValues, layout:{reduxName, compare_deps, compare_depth}} = nextProps; 
            if(compare_depth){
                let comparing=[]
                keys(values).map(v => {
                    if(compare_depth.depth == 1) {
                        comparing = concat(comparing, compare_depth.fields.map(compare => `${v}.${compare}`) )
                    }else {
                        keys(values[v]).map(v2 => {
                            comparing = concat(comparing, compare_depth.fields.map(compare => `${v}.${v2}.${compare}`) )
                        })
                    }
                })
                if(!isEqual(pick(values, comparing), pick(formValues, comparing))) {
                    appendPath('form', `${reduxName}.depth_values`, {...pick(formValues, comparing), ...pick(values, comparing)});
                }
            }
            if(!isEqual(pick(values, compare_deps), pick(formValues, compare_deps))) {
                appendPath('form', `${reduxName}.values`, {...pick(formValues, compare_deps), ...pick(values, compare_deps)});
            }
        }

        renderControls = () => {
            const { layout } = this.props
            return this.renderForm(layout.fields)
        }
        render() {
            const {layout, formValues, appendPath} = this.props
            return <BasicComponent 
                        layout={layout} 
                        formValues={formValues} 
                        appendPath={appendPath} 
                        compare={this.compares}
                        values={this.props.values}>
                        <WrappedComponent {...this.props} renderControls={this.renderControls} />
                    </BasicComponent>
        }

    }
    const MainComponent = connect(mapStateToProps, mapDispatchToProps)(FormComponent);
    return MainComponent;   
}
