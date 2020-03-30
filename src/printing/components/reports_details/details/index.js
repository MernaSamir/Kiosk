import React, { Component } from 'react'
import { map, get } from 'lodash'
import Sales from './sales'
import DataRender from './data_render'
import PM from './pm'
import Menus from './menus'
import Footer from './footer'

export default class Details extends Component {

    renderDetails = () => {
        const { settings } = this.props
        return map(get(settings, 'details'), (d, index) => {
            return <DataRender settings={d} key={index} />
        })
    }

    renderSales = () => {
        const { settings } = this.props
        if (get(settings, 'salesDetails')) {
            return <Sales />
        }
    }

    renderPM = () => {
        const { settings } = this.props
        if (get(settings, 'pm')) {
            return <PM settings={settings} />
        }
    }

    render() {
        return (
            <>
                {this.renderSales()}
                {this.renderDetails()}
                {this.renderPM()}
            </>
        )
    }
}
