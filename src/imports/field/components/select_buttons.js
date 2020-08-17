 import React from 'react';
import InputComponent from 'helpers/components/input.js'
import {connect} from 'react-redux'
import {isEmpty, isEqual, get, map, pick} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import {withTranslation} from 'react-i18next'
import applyFilters from 'helpers/functions/filters'

class selectButtons extends InputComponent {
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['list']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }
    constructor(props) {
        super(props);
        this.list = props.options || applyFilters({
            path: props.app,
            key: 'Filter',
            params: props.params
        })

    this.selectFirst()

    }
    // componentDidMount() {
        
    //   const {list, fetchAll, app} = this.props;
    //   if(isEmpty(list) && app){
    //     fetchAll([{
    //         app: app.name,
    //         api: app.api
    //     }])
    //   }else{
    //       this.selectFirst()
    //   }
    // }
    onClick = (d)=>{

        this.onChange(d.id)
        if(this.props.onClick){

            this.props.onClick(d)
        }
    }
    selectFirst(){
        const {selectFirst, list, field} = this.props
        if(selectFirst && !field.value){
            const value = get(this.list, '[0].id');
            if(value){
                this.onChange(value);
            }
        }
    }
    componentDidUpdate(prevProps){
        if(!isEqual(this.list, prevProps.this.list)){
            this.selectFirst()
        }
    }
    renderOptions = () => {
        const { list, field, t } = this.props
        return map(this.list, (d, key) => (
            <button key={key} type="button" className={(field.value == d.id) ? "active":""} 
            onClick={this.onClick.bind(this, d)}>{t(d.name)}</button>
        ))
    }
    render() {
          this.selectFirst()
        const { className}=this.props
        return (
                <div className={className || ''}>
                    {this.renderOptions()}
                </div>
        );
    }
}
const mapStateToProps = (state, props)=> ({
    list: map(props.options || get(state, `${get(props.app, 'name', '')}.data`, {}), d=>d)
})
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(selectButtons));
