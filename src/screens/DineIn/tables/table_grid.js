/* eslint-disable react/display-name */
import React, {Component} from 'react'
import AdminTable from './admin_table'
import Table from './table'
import { isEmpty, get, isEqual, map, keys } from 'lodash'
import { getShape } from 'helpers/index'
import { message } from 'antd'
import classes from './style.less';
import applyFilters from 'helpers/functions/filters'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
const y = 25, x = 25;

class TableGrid extends Component {

    state = {
        gridArea: [[]]
    }
    getData = () => {
        const {zone} = this.props;
        this.list = applyFilters({key: 'Filter', path: 'dinin__tables', params: {zone}})
        this.generateGrid();
    }
    addTable=(pos_x, pos_y)=>{
        const { item, appendPath, zone } = this.props
        if(item.id){
            appendPath('dinin__tables', 'item', { pos_x, pos_y, zone, action: 'update' ,onSuccess(){
                return [{
                    type: 'set_main_dinin__tables',
                    data: {active:''}
                }]
                }})
        }
        else{
            appendPath('dinin__tables', 'item', { pos_x, pos_y, zone, action: 'add' })
            }
    }
    drawTable = (pos_x, pos_y) => {
        const { item  ,popup } = this.props
        if(!isEmpty(item)  && !popup){
            const shape = getShape(pos_x, pos_y, item.size, item.shape, {width:x, height:y })
            const {gridArea} = this
            if (shape != -1) {
                let isValid = true;
                const itemShape = getShape(item.pos_x, item.pos_y, item.size, item.shape, {width:x, height:y })
                let check = false
                for(let i =0; i < shape.length; i++){
                    let element = shape[i]
                    check = Boolean(itemShape.find(v=>isEqual(v,element)))
                    if (gridArea[element.pos_y][element.pos_x].taken || gridArea[element.pos_y][element.pos_x].name) {
                        isValid = false
                        break;
                    }
                }

                 if(check){
                     isValid= true
                 }
                if (isValid) {
                    this.addTable(pos_x, pos_y)

                }
                else {
                    message.error("there's not enough space")
                }
            }
            else {
                message.error("this area out of boundries")

            }
        }

    }
    generateGrid = () => {
        const { list } = this
        let row = [], grid = []
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                row.push({ pos_x: j, pos_y: i })
            }
            grid.push(row)
            row = []
        }
        map(list, table => {
            grid[table.pos_y][table.pos_x] = table
            const shape = getShape(table.pos_x, table.pos_y, table.size, table.shape, {width:x, height:y })
            shape.map(v=>{
                grid[v.pos_y][v.pos_x] = {...grid[v.pos_y][v.pos_x],taken:true}
            })

        })
        this.gridArea = grid;
    }



    renderTable = (table) => {
        const { setMain, setAll, type } = this.props
        let unit
        if (window.innerWidth <= 1100) {
            unit = 3.8
        }
        else {
            unit = 2.9
        }

        if(type == 'work' && !table.closed )
            return <Table {...{ table_id: table.id, setMain, setAll, unit }}/>
        else if(type != 'work' ){
                return <AdminTable {...{ table_id: table.id, setMain, setAll, unit }} />
        }
        return ''

    }
    renderClass =()=>{
        const {item = {}} = this.props
        if(item.name){
            return `${classes.cell} ${classes.border}`
        }
        else{
            return classes.cell
        }
    }

    renderGrid = () => {
        let cells = []
        const { gridArea } = this
        gridArea.map(d => d.map(v => {
            if (v.name) {
                cells.push(<div key={`${v.pos_x}_${v.pos_y}`}
                onClick={this.drawTable.bind(this, v.pos_x, v.pos_y)}
                id = {`${v.pos_x}_${v.pos_y}`} className={classes.cell}>{this.renderTable(v)}</div>)
            }
            else {
                cells.push(<div key={`${v.pos_x}_${v.pos_y}`} id = {`${v.pos_x}_${v.pos_y}`}
                onClick={this.drawTable.bind(this, v.pos_x, v.pos_y)}
                 className={this.renderClass()}></div>)
            }
        }))
        return cells
    }

    render() {
        this.getData();
        return (
            <div className={classes.grid}>
                {this.renderGrid()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    zone: state.dinin__zones.active,
    item: state.dinin__tables.item,
    keys: keys(state.dinin__tables.data),
    popup: get(state.dinin__tables, 'popup.type',false),
    move: get(state.dinin__tables, 'move', false)
})

export default connect(mapStateToProps, mapDispatchToProps)(TableGrid)
