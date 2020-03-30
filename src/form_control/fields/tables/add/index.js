import React from 'react'
import mgStyle from './mg-style.less'
import { connect } from 'react-redux'
import { appActions } from 'helpers/actions/main'
import { get, map, isEqual, pick, pickBy, keys } from 'lodash'
import { Formik } from 'formik';
import uuid from 'uuid/v4';
import { InputRow, Header } from 'helpers/components/table';
import InputComponent from 'helpers/components/input';
import Add_new_item from './add_new_item'
import { withRouter } from 'react-router'
import applyFilters from 'helpers/functions/filters'
import { message } from 'antd'
import { ConnectAllApps } from 'helpers/functions'
import { withTranslation } from 'react-i18next'

const mapDispatchToProps = appActions({
    name: 'items__prices',
})

class Table_add_plus extends InputComponent {
    state = {
        page: 0,
        record: {},
        display: 'none'
    }
    getAppsData = (props) => {
        const { fetchingApis } = props;
        if (fetchingApis) {
            ConnectAllApps(props, fetchingApis, undefined)
        }
    }
    componentDidMount() {
        this.getAppsData(this.props);
    }
    addnewRecord = (values, props) => {
        const { field, links = { key: 'mapSelect', select: {} }, max_length } = this.props;
        if (max_length) {
            const vals = keys(field.value);
            if (vals.length >= max_length) {
                return message.warning("Cannot add more you have reach max input")
            }
        }
        const value = { ...values, ...applyFilters(links, {}) }
        const id = uuid();
        this.onChange({ ...field.value, [id]: { ...value, id } });
        props.resetForm({})
    }
    renderHeader = () => {
        const { table_columns } = this.props
        return map(table_columns, (f, i) => {
            return <Header field={f} key={i} />
        })
    }
    renderClickButtonHeader = (d) => {
        const { push_url } = this.props
        if (push_url) {
            return <td className={mgStyle.header_td}></td>
        }
    }
    renderRows() {
        const { field, push_url, table_columns: fields, filter, extras, staticValueKey = "", filterVal, remove, doc } = this.props;
        let mainFilter = { key: "Filter", params: pickBy({ [staticValueKey]: filterVal }, (d, v) => v) }
        const list = applyFilters(filter || mainFilter, field.value);
        return <InputRow
            list={list}
            fields={fields}
            extras={extras}
            field={field}
            handleClick={this.handleClick}
            push_url={push_url}
            doc={doc}
            handleRemove={this.handleRemove}
            remove={remove}
        />
    }

    handleClick = (d) => {
        const { push_url, doc=push_url, history, doc_condition } = this.props
        let is_draft = get(d, 'is_draft')
        if (is_draft) {
            history.push('/app' + push_url + get(d, 'id', ''))
        } else if(doc_condition) {
            let condition = get(d, doc_condition.key) == doc_condition.value
            condition ? history.push('/app' + push_url + get(d, 'id', '')) :
            history.push(['/app', doc, get(d, 'id', '')].join(''))
        }else { 
            history.push(['/app', doc, get(d, 'id', '')].join('')) 
        }
    }

    handleRemove = (d) => {
        const { field } = this.props
        let id = get(d, 'id', '')
        this.onChange({ ...field.value, [id]: { ...field.value[id], remove: !field.value[id].remove } })
    }

    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['activeId', 'field.value', 'form.initialValues', 'mainForm', 'reduxName'];
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }
    renderAddNew() {
        const { add_new_item, table_columns: fields, viewbtn } = this.props;
        if (add_new_item) {
            return <Formik onSubmit={this.addnewRecord} enableReinitialize={true}>
                {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
                    <Add_new_item
                        viewbtn={viewbtn}
                        add_new_item={fields}
                        handleSubmit={handleSubmit}
                        mainValues={values}
                    />
                )}
            </Formik>

        }
    }

    renderNewButton = () => {
        const { header_new_button, t, history, push_url } = this.props
        if (header_new_button) {
            return <button
                className={mgStyle.new_button}
                onClick={() => history.push('/app' + push_url)}>
                {t('New')}
                </button>
        }
    }

    renderTotal = () => {
        const { table_columns, showTotal } = this.props
        if (showTotal) {
            return map(table_columns, (d, key) => {
                const path = get(d, 'total', '')
                const val = applyFilters({ path })
                return <td key={key}>{val}</td>
            })
        }

    }

    render() {
        const { select, mainKey } = this.props;
        if (select && !mainKey) {
            return <></>
        }
        return (
            <>
                <div className={`${mgStyle.MGdiv} ${mgStyle.hidescroll}`} >
                    {this.renderNewButton()}
                    <table className={mgStyle.MGtable}>
                        <thead>
                            <tr>
                                {this.renderClickButtonHeader()}
                                {this.renderHeader()}
                            </tr>
                        </thead>

                        <tbody>
                            {this.renderAddNew()}
                            {this.renderRows()}
                            <tr>{this.renderTotal()}</tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state, props) => ({
    activeId: get(state, `${get(props, 'activeReduxName', '')}.active`),
    mainForm: get(state, `form.${props.reduxName}`),
    mainKey: get(state, props.select, ""),
    filterVal: get(state, props.staticValue, '')
})

const wrapper = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Table_add_plus))
const Add_Table = withRouter(wrapper)
export default Add_Table
