import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from 'rc-animate';
import Row from '../grid/row';
import Col from '../grid/col';
import Icon from '../icon';
import { ConfigConsumer } from '../config-provider';
import warning from '../_util/warning';
import { tuple } from '../_util/type';
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants';
import { FormContext } from './context';
const ValidateStatuses = tuple('success', 'warning', 'error', 'validating', '');
function intersperseSpace(list) {
    return list.reduce((current, item) => [...current, ' ', item], []).slice(1);
}
export default class FormItem extends React.Component {
    constructor() {
        super(...arguments);
        this.helpShow = false;
        this.onHelpAnimEnd = (_key, helpShow) => {
            this.helpShow = helpShow;
            if (!helpShow) {
                this.setState({});
            }
        };
        // Resolve duplicated ids bug between different forms
        // https://github.com/ant-design/ant-design/issues/7351
        this.onLabelClick = () => {
            const id = this.props.id || this.getId();
            if (!id) {
                return;
            }
            const formItemNode = ReactDOM.findDOMNode(this);
            const control = formItemNode.querySelector(`[id="${id}"]`);
            if (control && control.focus) {
                control.focus();
            }
        };
        this.renderFormItem = ({ getPrefixCls }) => {
            const { prefixCls: customizePrefixCls, style, className } = this.props;
            const prefixCls = getPrefixCls('form', customizePrefixCls);
            const children = this.renderChildren(prefixCls);
            const itemClassName = {
                [`${prefixCls}-item`]: true,
                [`${prefixCls}-item-with-help`]: this.helpShow,
                [`${className}`]: !!className,
            };
            return (<Row className={classNames(itemClassName)} style={style} key="row">
        {children}
      </Row>);
        };
    }
    componentDidMount() {
        const { children, help, validateStatus } = this.props;
        warning(this.getControls(children, true).length <= 1 ||
            (help !== undefined || validateStatus !== undefined), 'Form.Item', 'Cannot generate `validateStatus` and `help` automatically, ' +
            'while there are more than one `getFieldDecorator` in it.');
    }
    getHelpMessage() {
        const { help } = this.props;
        if (help === undefined && this.getOnlyControl()) {
            const { errors } = this.getField();
            if (errors) {
                return intersperseSpace(errors.map((e, index) => {
                    let node = null;
                    if (React.isValidElement(e)) {
                        node = e;
                    }
                    else if (React.isValidElement(e.message)) {
                        node = e.message;
                    }
                    return node ? React.cloneElement(node, { key: index }) : e.message;
                }));
            }
            return '';
        }
        return help;
    }
    getControls(children, recursively) {
        let controls = [];
        const childrenArray = React.Children.toArray(children);
        for (let i = 0; i < childrenArray.length; i++) {
            if (!recursively && controls.length > 0) {
                break;
            }
            const child = childrenArray[i];
            if (child.type &&
                (child.type === FormItem || child.type.displayName === 'FormItem')) {
                continue;
            }
            if (!child.props) {
                continue;
            }
            if (FIELD_META_PROP in child.props) {
                // And means FIELD_DATA_PROP in child.props, too.
                controls.push(child);
            }
            else if (child.props.children) {
                controls = controls.concat(this.getControls(child.props.children, recursively));
            }
        }
        return controls;
    }
    getOnlyControl() {
        const child = this.getControls(this.props.children, false)[0];
        return child !== undefined ? child : null;
    }
    getChildProp(prop) {
        const child = this.getOnlyControl();
        return child && child.props && child.props[prop];
    }
    getId() {
        return this.getChildProp('id');
    }
    getMeta() {
        return this.getChildProp(FIELD_META_PROP);
    }
    getField() {
        return this.getChildProp(FIELD_DATA_PROP);
    }
    renderHelp(prefixCls) {
        const help = this.getHelpMessage();
        const children = help ? (<div className={`${prefixCls}-explain`} key="help">
        {help}
      </div>) : null;
        if (children) {
            this.helpShow = !!children;
        }
        return (<Animate transitionName="show-help" component="" transitionAppear key="help" onEnd={this.onHelpAnimEnd}>
        {children}
      </Animate>);
    }
    renderExtra(prefixCls) {
        const { extra } = this.props;
        return extra ? <div className={`${prefixCls}-extra`}>{extra}</div> : null;
    }
    getValidateStatus() {
        const onlyControl = this.getOnlyControl();
        if (!onlyControl) {
            return '';
        }
        const field = this.getField();
        if (field.validating) {
            return 'validating';
        }
        if (field.errors) {
            return 'error';
        }
        const fieldValue = 'value' in field ? field.value : this.getMeta().initialValue;
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            return 'success';
        }
        return '';
    }
    renderValidateWrapper(prefixCls, c1, c2, c3) {
        const { props } = this;
        const onlyControl = this.getOnlyControl;
        const validateStatus = props.validateStatus === undefined && onlyControl
            ? this.getValidateStatus()
            : props.validateStatus;
        let classes = `${prefixCls}-item-control`;
        if (validateStatus) {
            classes = classNames(`${prefixCls}-item-control`, {
                'has-feedback': props.hasFeedback || validateStatus === 'validating',
                'has-success': validateStatus === 'success',
                'has-warning': validateStatus === 'warning',
                'has-error': validateStatus === 'error',
                'is-validating': validateStatus === 'validating',
            });
        }
        let iconType = '';
        switch (validateStatus) {
            case 'success':
                iconType = 'check-circle';
                break;
            case 'warning':
                iconType = 'exclamation-circle';
                break;
            case 'error':
                iconType = 'close-circle';
                break;
            case 'validating':
                iconType = 'loading';
                break;
            default:
                iconType = '';
                break;
        }
        const icon = props.hasFeedback && iconType ? (<span className={`${prefixCls}-item-children-icon`}>
          <Icon type={iconType} theme={iconType === 'loading' ? 'outlined' : 'filled'}/>
        </span>) : null;
        return (<div className={classes}>
        <span className={`${prefixCls}-item-children`}>
          {c1}
          {icon}
        </span>
        {c2}
        {c3}
      </div>);
    }
    renderWrapper(prefixCls, children) {
        return (<FormContext.Consumer key="wrapper">
        {({ wrapperCol: contextWrapperCol, vertical }) => {
            const { wrapperCol } = this.props;
            const mergedWrapperCol = ('wrapperCol' in this.props ? wrapperCol : contextWrapperCol) || {};
            const className = classNames(`${prefixCls}-item-control-wrapper`, mergedWrapperCol.className);
            // No pass FormContext since it's useless
            return (<FormContext.Provider value={{ vertical }}>
              <Col {...mergedWrapperCol} className={className}>
                {children}
              </Col>
            </FormContext.Provider>);
        }}
      </FormContext.Consumer>);
    }
    isRequired() {
        const { required } = this.props;
        if (required !== undefined) {
            return required;
        }
        if (this.getOnlyControl()) {
            const meta = this.getMeta() || {};
            const validate = meta.validate || [];
            return validate
                .filter((item) => !!item.rules)
                .some((item) => {
                return item.rules.some((rule) => rule.required);
            });
        }
        return false;
    }
    renderLabel(prefixCls) {
        return (<FormContext.Consumer key="label">
        {({ vertical, labelAlign, labelCol: contextLabelCol, colon: contextColon, }) => {
            const { label, labelCol, colon, id } = this.props;
            const required = this.isRequired();
            const mergedLabelCol = ('labelCol' in this.props ? labelCol : contextLabelCol) || {};
            const labelClsBasic = `${prefixCls}-item-label`;
            const labelColClassName = classNames(labelClsBasic, labelAlign === 'left' && `${labelClsBasic}-left`, mergedLabelCol.className);
            let labelChildren = label;
            // Keep label is original where there should have no colon
            const computedColon = colon === true || (contextColon !== false && colon !== false);
            const haveColon = computedColon && !vertical;
            // Remove duplicated user input colon
            if (haveColon && typeof label === 'string' && label.trim() !== '') {
                labelChildren = label.replace(/[：|:]\s*$/, '');
            }
            const labelClassName = classNames({
                [`${prefixCls}-item-required`]: required,
                [`${prefixCls}-item-no-colon`]: !computedColon,
            });
            return label ? (<Col {...mergedLabelCol} className={labelColClassName}>
              <label htmlFor={id || this.getId()} className={labelClassName} title={typeof label === 'string' ? label : ''} onClick={this.onLabelClick}>
                {labelChildren}
              </label>
            </Col>) : null;
        }}
      </FormContext.Consumer>);
    }
    renderChildren(prefixCls) {
        const { children } = this.props;
        return [
            this.renderLabel(prefixCls),
            this.renderWrapper(prefixCls, this.renderValidateWrapper(prefixCls, children, this.renderHelp(prefixCls), this.renderExtra(prefixCls))),
        ];
    }
    render() {
        return <ConfigConsumer>{this.renderFormItem}</ConfigConsumer>;
    }
}
FormItem.defaultProps = {
    hasFeedback: false,
};
FormItem.propTypes = {
    prefixCls: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelAlign: PropTypes.string,
    labelCol: PropTypes.object,
    help: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    validateStatus: PropTypes.oneOf(ValidateStatuses),
    hasFeedback: PropTypes.bool,
    wrapperCol: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    children: PropTypes.node,
    colon: PropTypes.bool,
};
