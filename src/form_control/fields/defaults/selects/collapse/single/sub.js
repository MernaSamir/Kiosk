import React from 'react';
import InputComponent from 'helpers/components/input';
import { map, get, filter, pick, isEqual } from 'lodash';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilter from 'helpers/functions/filters';
import Show from 'helpers/components/common/show';
class TableCollapseRow extends InputComponent {

    state = {
        expand: false,
        transform: 'rorate(0deg)',
        transitionDuration: '0.4s',
    }
    activeCollapse = (data) => {
        const {child} = this.props;
        const {expand} = this.state;
        if(child){
            this.changeCollapse(expand);
        }else{
            this.selectValue(data)
        }
    }
    selectValue(data){
        const {mainChange, field} = this.props;
        mainChange({
            target: {
                name: field.name,
                value: data.id
            }
        })
    }
    changeCollapse(expand){
        this.setState({
            expand: !expand,
            transform: expand ? 'rotate(0deg)':'rotate(180deg)'
        })

    }
    shouldComponentUpdate(nextProps, nextState, ...props) {
        const compare = ['mainFilter'];
        const su = isEqual(pick(nextProps, compare), pick(this.props, compare)); 
        if(su){
            this.list = this.getFilteredData(nextProps)
        }
        return super.shouldComponentUpdate(nextProps, nextProps, ...props)
    }
    getFilteredData(props){
        const {mainList} = this;
        const {mainFilter} = props;
        this.list = applyFilter(mainFilter, mainList);
    }
    constructor(props){
        super(props);
        const {child={}, data} = props;
        this.mainList = filter(props.childData, {[child.match]: data.id});
        this.getFilteredData(props)
    }
    renderInnerRow(d) {
        let { field, child = {}, mainChange, ChildComponent, index } = this.props
        return <ChildComponent
            index={index}
            d={d}
            mainChange={mainChange}
            field={field}
            {...child}
        />
    }
    
    
    renderGroupBody = () => {
        const {data, show, child} = this.props;
        const {expand} = this.state;
        return <>
            <Show data={data} filter={show} expand={expand} collapse={Boolean(child)} onClick={this.activeCollapse} />
            {expand && this.renderInnerRow(data)}
        </>
    }
    render() {
        return this.renderGroupBody()
    }
}

const mapStateToProps = (state, props) => ({
    childData: get(state, `${get(props, 'child.reduxName','')}.data`, {}),
    mainFilter: get(state.filters, `${props.field.name}.data`, {})
})

export default connect(mapStateToProps, mapDispatchToProps)(TableCollapseRow)
