import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'omit.js';
import { polyfill } from 'react-lifecycles-compat';
import { ConfigConsumer } from '../config-provider';
import Icon from '../icon';
import { tuple } from '../_util/type';
import warning from '../_util/warning';
function fixControlledValue(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }
    return value;
}
function hasPrefixSuffix(props) {
    return !!('prefix' in props || props.suffix || props.allowClear);
}
const InputSizes = tuple('small', 'default', 'large');
class Input extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = (e) => {
            const { onPressEnter, onKeyDown } = this.props;
            if (e.keyCode === 13 && onPressEnter) {
                onPressEnter(e);
            }
            if (onKeyDown) {
                onKeyDown(e);
            }
        };
        this.saveInput = (node) => {
            this.input = node;
        };
        this.handleReset = (e) => {
            this.setValue('', e, () => {
                this.focus();
            });
        };
        this.handleChange = (e) => {
            this.setValue(e.target.value, e);
        };
        this.renderComponent = ({ getPrefixCls }) => {
            const { prefixCls: customizePrefixCls } = this.props;
            const prefixCls = getPrefixCls('input', customizePrefixCls);
            return this.renderLabeledInput(prefixCls, this.renderInput(prefixCls));
        };
        const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
        this.state = {
            value,
        };
    }
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                value: nextProps.value,
            };
        }
        return null;
    }
    getSnapshotBeforeUpdate(prevProps) {
        if (hasPrefixSuffix(prevProps) !== hasPrefixSuffix(this.props)) {
            warning(this.input !== document.activeElement, 'Input', `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change. Read more: https://ant.design/components/input/#FAQ`);
        }
        return null;
    }
    // Since polyfill `getSnapshotBeforeUpdate` need work with `componentDidUpdate`.
    // We keep an empty function here.
    componentDidUpdate() { }
    focus() {
        this.input.focus();
    }
    blur() {
        this.input.blur();
    }
    select() {
        this.input.select();
    }
    getInputClassName(prefixCls) {
        const { size, disabled } = this.props;
        return classNames(prefixCls, {
            [`${prefixCls}-sm`]: size === 'small',
            [`${prefixCls}-lg`]: size === 'large',
            [`${prefixCls}-disabled`]: disabled,
        });
    }
    setValue(value, e, callback) {
        if (!('value' in this.props)) {
            this.setState({ value }, callback);
        }
        const { onChange } = this.props;
        if (onChange) {
            let event = e;
            if (e.type === 'click') {
                // click clear icon
                event = Object.create(e);
                event.target = this.input;
                event.currentTarget = this.input;
                const originalInputValue = this.input.value;
                // change input value cause e.target.value should be '' when clear input
                this.input.value = '';
                onChange(event);
                // reset input value
                this.input.value = originalInputValue;
                return;
            }
            onChange(event);
        }
    }
    renderClearIcon(prefixCls) {
        const { allowClear } = this.props;
        const { value } = this.state;
        if (!allowClear || value === undefined || value === null || value === '') {
            return null;
        }
        return (<Icon type="close-circle" theme="filled" onClick={this.handleReset} className={`${prefixCls}-clear-icon`} role="button"/>);
    }
    renderSuffix(prefixCls) {
        const { suffix, allowClear } = this.props;
        if (suffix || allowClear) {
            return (<span className={`${prefixCls}-suffix`}>
          {this.renderClearIcon(prefixCls)}
          {suffix}
        </span>);
        }
        return null;
    }
    renderLabeledInput(prefixCls, children) {
        const { addonBefore, addonAfter, style, size, className } = this.props;
        // Not wrap when there is not addons
        if (!addonBefore && !addonAfter) {
            return children;
        }
        const wrapperClassName = `${prefixCls}-group`;
        const addonClassName = `${wrapperClassName}-addon`;
        const addonBeforeNode = addonBefore ? (<span className={addonClassName}>{addonBefore}</span>) : null;
        const addonAfterNode = addonAfter ? <span className={addonClassName}>{addonAfter}</span> : null;
        const mergedWrapperClassName = classNames(`${prefixCls}-wrapper`, {
            [wrapperClassName]: addonBefore || addonAfter,
        });
        const mergedGroupClassName = classNames(className, `${prefixCls}-group-wrapper`, {
            [`${prefixCls}-group-wrapper-sm`]: size === 'small',
            [`${prefixCls}-group-wrapper-lg`]: size === 'large',
        });
        // Need another wrapper for changing display:table to display:inline-block
        // and put style prop in wrapper
        return (<span className={mergedGroupClassName} style={style}>
        <span className={mergedWrapperClassName}>
          {addonBeforeNode}
          {React.cloneElement(children, { style: null })}
          {addonAfterNode}
        </span>
      </span>);
    }
    renderLabeledIcon(prefixCls, children) {
        const { props } = this;
        const suffix = this.renderSuffix(prefixCls);
        if (!hasPrefixSuffix(props)) {
            return children;
        }
        const prefix = props.prefix ? (<span className={`${prefixCls}-prefix`}>{props.prefix}</span>) : null;
        const affixWrapperCls = classNames(props.className, `${prefixCls}-affix-wrapper`, {
            [`${prefixCls}-affix-wrapper-sm`]: props.size === 'small',
            [`${prefixCls}-affix-wrapper-lg`]: props.size === 'large',
        });
        return (<span className={affixWrapperCls} style={props.style}>
        {prefix}
        {React.cloneElement(children, {
            style: null,
            className: this.getInputClassName(prefixCls),
        })}
        {suffix}
      </span>);
    }
    renderInput(prefixCls) {
        const { className, addonBefore, addonAfter } = this.props;
        const { value } = this.state;
        // Fix https://fb.me/react-unknown-prop
        const otherProps = omit(this.props, [
            'prefixCls',
            'onPressEnter',
            'addonBefore',
            'addonAfter',
            'prefix',
            'suffix',
            'allowClear',
            // Input elements must be either controlled or uncontrolled,
            // specify either the value prop, or the defaultValue prop, but not both.
            'defaultValue',
        ]);
        return this.renderLabeledIcon(prefixCls, <input {...otherProps} value={fixControlledValue(value)} onChange={this.handleChange} className={classNames(this.getInputClassName(prefixCls), {
            [className]: className && !addonBefore && !addonAfter,
        })} onKeyDown={this.handleKeyDown} ref={this.saveInput}/>);
    }
    render() {
        return <ConfigConsumer>{this.renderComponent}</ConfigConsumer>;
    }
}
Input.defaultProps = {
    type: 'text',
    disabled: false,
};
Input.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    size: PropTypes.oneOf(InputSizes),
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    prefixCls: PropTypes.string,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    allowClear: PropTypes.bool,
};
polyfill(Input);
export default Input;
