import React from 'react';
import { ReactAgenda,  guid } from 'react-agenda';
import { map } from 'lodash';
import classes from "./style.css"
// import moment from 'moment';

var colors = {
    'color-1': "rgba(102, 195, 131 , 1)",
    "color-2": "rgba(242, 177, 52, 1)",
    "color-3": "rgba(235, 85, 59, 1)"
}

var now = new Date();

var items = [
    {
        _id: guid(),
        name: 'Meeting , dev staff!',
        startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
        endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
        classes: 'color-1'
    },
    {
        _id: guid(),
        name: 'Working lunch , Holly',
        startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
        endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
        classes: 'color-2 color-3'
    },

];

export default class Agenda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: items,
            selected: [],
            cellHeight: 30,
            showModal: false,
            locale: "en",
            rowsPerHour: 2,
            numberOfDays: 4,
            // startDate: new Date()
        }
        // this.handleCellSelection = this.handleCellSelection.bind(this)
        // this.handleItemEdit = this.handleItemEdit.bind(this)
        // this.handleRangeSelection = this.handleRangeSelection.bind(this)
    }

    // handleCellSelection(item){
    //   console.log('handleCellSelection',item)
    // }
    // handleItemEdit(item){
    //   console.log('handleItemEdit', item)
    // }
    // handleRangeSelection(item){
    //   console.log('handleRangeSelection', item)
    // }

    render() {
        const { list } = this.props
        let items = map(list, (d, i) => {
            let from= new Date(d.from_hour)
            let to= new Date(d.to)
            return {
                _id: d.id,
                startDateTime: new Date(from.getFullYear(), from.getMonth(), from.getDate()+1, from.getHours(), 0),
                endDateTime: new Date(to.getFullYear(), to.getMonth(), to.getDate()+1, to.getHours(), 0),
                name: d.event_name



            }
        })
        return (
            <div className={classes.agDiv}>

                <ReactAgenda
                    minDate={now}
                    maxDate={new Date(now.getFullYear(), now.getMonth() + 3)}
                    disablePrevButton={false}
                    startDate={this.state.startDate}
                    cellHeight={this.state.cellHeight}
                    locale={this.state.locale}
                    items={items}
                    numberOfDays={this.state.numberOfDays}
                    rowsPerHour={this.state.rowsPerHour}
                    itemColors={colors}
                    autoScale={false}
                    fixedHeader={true}

                />
            </div>
        );
    }
}