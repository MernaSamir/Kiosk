import React, { Component } from 'react';
import {get} from 'lodash';
import applyFilters from 'helpers/functions/filters'
class printer extends Component{
    handlePrint = (afterPrint, ...params)=>{
        setTimeout(this.print.bind(this, afterPrint, ...params), 300)
    }
    print = (afterPrint, printName, ...params)=>{
        const {printer=printName} = this.props;
        console.log(printer)
        if(window.electron){
            window.electron.ipcRenderer.send('print', printer.name || printer)
        }else{
            if(window.cordova){
                const printers = applyFilters({
                    path: 'settings__printer',
                    key: 'Find',
                    params: {
                        name: printer
                    }
                })
                if(printers){
                    window.cordova.plugins.printer.print(document.documentElement.innerHTML, {printer: printers.url});
                }
            }else{
                window.print();
            }
        }
        setTimeout(()=> {
            afterPrint(...params)
        }, 300);

    }
    finishPrinting = ()=>{
        const {printing, setMain} = this.props;
        get(printing, 'afterPrint', ()=>(Promise.resolve()))().then(()=>{
            setMain('Printing', {print: {}})
        })
    }
    render() {
        return (
            <div>
            </div>
        );
    }
}

export default printer;
