import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import createDOMForm from 'rc-form/lib/createDOMForm';
import createFormField from 'rc-form/lib/createFormField';
import omit from 'omit.js';
import { ConfigConsumer } from '../config-provider';
import { tuple } from '../_util/type';
import warning from '../_util/warning';
import FormItem from './FormItem';
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants';
import { FormContext } from './context';
const FormLayouts = tuple('horizontal', 'inline', 'vertical');
export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.renderForm = ({ getPrefixCls }) => {
            const { prefixCls: customizePrefixCls, hideRequiredMark, className = '', layout } = this.props;
            const prefixCls = getPrefixCls('form', customizePrefixCls);
            const formClassName = classNames(prefixCls, {
                [`${prefixCls}-horizontal`]: layout === 'horizontal',
                [`${prefixCls}-vertical`]: layout === 'vertical',
                [`${prefixCls}-inline`]: layout === 'inline',
                [`${prefixCls}-hide-required-mark`]: hideRequiredMark,
            }, className);
            const formProps = omit(this.props, [
                'prefixCls',
                'className',
                'layout',
                'form',
                'hideRequiredMark',
                'wrapperCol',
                'labelAlign',
                'labelCol',
                'colon',
            ]);
            return <form {...formProps} className={formClassName}/>;
        };
        warning(!props.form, 'Form', 'It is unnecessary to pass `form` to `Form` after antd@1.7.0.');
    }
    render() {
        const { wrapperCol, labelAlign, labelCol, layout, colon } = this.props;
        return (<FormContext.Provider value={{ wrapperCol, labelAlign, labelCol, vertical: layout === 'vertical', colon }}>
        <ConfigConsumer>{this.renderForm}</ConfigConsumer>
      </FormContext.Provider>);
    }
}
Form.defaultProps = {
    colon: true,
    layout: 'horizontal',
    hideRequiredMark: false,
    onSubmit(e) {
        e.preventDefault();
    },
};
Form.propTypes = {
    prefixCls: PropTypes.string,
    layout: PropTypes.oneOf(FormLayouts),
    children: PropTypes.any,
    onSubmit: PropTypes.func,
    hideRequiredMark: PropTypes.bool,
    colon: PropTypes.bool,
};
Form.Item = FormItem;
Form.createFormField = createFormField;
Form.create = function (options = {}) {
    return createDOMForm(Object.assign({ fieldNameProp: 'id' }, options, { fieldMetaProp: FIELD_META_PROP, fieldDataProp: FIELD_DATA_PROP }));
};
