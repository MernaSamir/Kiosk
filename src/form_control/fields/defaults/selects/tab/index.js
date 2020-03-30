import * as React from 'react';
import { Tabs } from 'antd';
import FormControls from 'form_control'
import { map, first, get } from 'lodash'
import InputComponent from "helpers/components/input"
import { withTranslation } from 'react-i18next';
const TabPane = Tabs.TabPane;



export class Tab extends InputComponent {
    constructor(props){
        super(props);
        const {field, tabs} = props;
        if(!field.value){
            this.handelChange(first(tabs).key)
        }
    }
    handelChange = (value, name) => {
        const {field} = this.props;
        field.onChange({
            target: {
                name:  this.getTabName(),
                value
            }
        })
    }
    getTabName(){
        const { field: {name=''}, tab_name } = this.props
        // console.log([name, tab_name].filter(d=>d).join('.'))
        return [name, tab_name].filter(d=>d).join('.')
    }

    renderGroup = () => {
        const { tabs, t } = this.props
        return map(tabs, (d, index) => {
            return <TabPane
                tab={t(d.label)}
                key={d.key}
                {...d}
            >
                {d.body ? this.renderBody(d.body) : undefined}
            </TabPane>
        })
    }


    renderBody(list) {
        return map(list, (d, index) => {
            return <FormControls
                key={index}
                {...d}
                name={this.getFieldName(d)}
            />

        })

    }
    getFieldName(f){
        const { concat_name=true, field: {name=''} } = this.props
        // console.log()
        return [concat_name && name, f.name].filter(d=>d).join('.')
    }
    render() {
        const { field, tab_name } = this.props
        return (
            <div>
                <Tabs
                    activeKey={String(get(field.value, tab_name, field.value))}
                    onChange={this.handelChange}
                >
                    {this.renderGroup()}
                </Tabs>
            </div>
        );
    }
}

export default withTranslation()(Tab);
