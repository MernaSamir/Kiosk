import React from 'react'
import mgStyle from './mg-style.less'
import { connect } from 'react-redux'
import { appActions } from 'helpers/actions/main'
import { get, map, isEqual, pick, toArray } from 'lodash'
import { Formik } from 'formik';
import uuid from 'uuid/v4';
import { ColRow } from 'helpers/components/table';
import InputComponent from 'helpers/components/input';
import Add_new_item from './add_new_item'
import applyFilters from 'helpers/functions/filters'

const mapDispatchToProps = appActions({
    name: 'items__prices',
})

class Table_add_plus extends InputComponent {
    state = {
        page: 0,
        record: {},
        display: 'none'
    }
    addnewRecord = (values, props) => {
        const { field, links = { key: 'mapSelect', select: {} } } = this.props;
        const value = { ...values, ...applyFilters(links, {}) }
        const id = uuid();
        this.onChange({ ...field.value, [id]: { ...value, id } });
        props.resetForm({})
    }
    renderHeader = () => {
        const { table_columns } = this.props
        return map(table_columns, (f, i) => {
            return <td key={i} className={mgStyle.header_td}>{f.head}</td>
        })
    }
    renderRows() {
        const { field, table_columns: fields, extras, filter = { key: "List", select: {} } } = this.props;
        const list = applyFilters(filter, field.value);
        return <ColRow list={list} fields={fields} extras={extras} field={field} />

    }

    handleRowClick = (id) => {
        const { SetMain } = this.props
        SetMain({ 'active': id })
    }

    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['activeId', 'field.value', 'form.initialValues', 'mainForm', 'reduxName'];
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }
    renderAddNew() {
        const { add_new_item, table_columns: fields } = this.props;
        if (add_new_item) {
            return <Formik onSubmit={this.addnewRecord} enableReinitialize={true}>
                {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
                    <Add_new_item
                        add_new_item={fields}
                        handleSubmit={handleSubmit}
                        mainValues={values}
                    />
                )}
            </Formik>
        }
    }
    render() {
        return (
            <div className={`${mgStyle.MGdiv} ${mgStyle.hidescroll}`} >
                <table className={mgStyle.MGtable}>
                    <thead>
                        <tr>
                            {/* {this.renderHeader()} */}
                        </tr>
                    </thead>

                    <tbody>
                        {this.renderAddNew()}
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    activeId: get(state, `${get(props, 'activeReduxName', '')}.active`),
    mainForm: get(state, `form.${props.reduxName}`)
})

export const Add_Table_Collapse = connect(mapStateToProps, mapDispatchToProps)(Table_add_plus)
export default Add_Table_Collapse
