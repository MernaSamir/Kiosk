import moment from 'moment'
export {default as SelectBox} from './select_box'
import applyFilters from 'helpers/functions/filters'
import {get} from 'lodash'

export const date = (data, row, field ,props) => {
    return moment(data).format('DD-MM-YYYY')
}
export const ButtonPopup = date;
export const SelectA = (data, row, field ,props) => {
    return applyFilters({
        path: `${get(field, 'app.name')}.data.${data}.name`
    })
};

export const label = (data, row, field ,props) => {
    return field.msg
};