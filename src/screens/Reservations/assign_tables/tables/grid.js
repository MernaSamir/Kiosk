/* eslint-disable react/display-name */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { getShape } from 'helpers/index'
import mapDispatchToProps from 'helpers/actions/main'
import { get, filter, isEqual, pick, map } from 'lodash'
import Table from './table'
import classes from './style.less';

const y = 25, x = 25;

class Grid extends Component {

    state = {
        gridArea: [[]]
    }
   
    componentDidMount() {
        this.generateGrid()
    }
        componentDidUpdate(prevProps, ...input) {
        // super.componentDidUpdate(prevProps, ...input);
     
        if (!isEqual(this.props.list, prevProps.list)) {
            this.generateGrid()

        }

    }
    generateGrid = () => {
        const { list } = this.props
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
        this.setState({ gridArea: grid })
    }



    renderTable = (table) => {
        const { setMain } = this.props
        const unit =2.7
        
        if(!table.closed )
            return <Table {...{ table, setMain, unit }}/>
       

    }

    shouldComponentUpdate=(nextProps, nextState)=>{
        let compare = ['zone','list','item']
        return !isEqual(pick(this.props,compare), pick(nextProps,compare)) || !isEqual(this.state, nextState)
    }
    renderGrid = () => {
        let cells = []
        const { gridArea } = this.state
        gridArea.map(d => d.map(v => {
            if (v.name) {
                cells.push(<div key={`${v.pos_x}_${v.pos_y}`}
               
                id = {`${v.pos_x}_${v.pos_y}`} className={classes.cell}>{this.renderTable(v)}</div>)
            }
            else {
                cells.push(<div key={`${v.pos_x}_${v.pos_y}`} id = {`${v.pos_x}_${v.pos_y}`}
                 className={classes.cell}></div>)
            }
        }))
        return cells
    }



    render() {
        return (
            <div className={classes.grid}>
                { this.renderGrid() }
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    list: filter(state.dinin__tables.data, { zone: state.dinin__zones.active }),
    zone: get(state.dinin__zones, 'active', ''),
    item: state.item,
})

export default connect(mapStateToProps, mapDispatchToProps)( Grid)
