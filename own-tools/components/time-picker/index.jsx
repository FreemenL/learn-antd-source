var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import * as moment from 'moment';
import omit from 'omit.js';
import { polyfill } from 'react-lifecycles-compat';
import RcTimePicker from 'rc-time-picker/lib/TimePicker';
import classNames from 'classnames';
import warning from '../_util/warning';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { ConfigConsumer } from '../config-provider';
import enUS from './locale/en_US';
import interopDefault from '../_util/interopDefault';
import Icon from '../icon';
export function generateShowHourMinuteSecond(format) {
    // Ref: http://momentjs.com/docs/#/parsing/string-format/
    return {
        showHour: format.indexOf('H') > -1 || format.indexOf('h') > -1 || format.indexOf('k') > -1,
        showMinute: format.indexOf('m') > -1,
        showSecond: format.indexOf('s') > -1,
    };
}
class TimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (value) => {
            if (!('value' in this.props)) {
                this.setState({ value });
            }
            const { onChange, format = 'HH:mm:ss' } = this.props;
            if (onChange) {
                onChange(value, (value && value.format(format)) || '');
            }
        };
        this.handleOpenClose = ({ open }) => {
            const { onOpenChange } = this.props;
            if (onOpenChange) {
                onOpenChange(open);
            }
        };
        this.saveTimePicker = (timePickerRef) => {
            this.timePickerRef = timePickerRef;
        };
        this.getDefaultLocale = () => {
            const defaultLocale = Object.assign({}, enUS, this.props.locale);
            return defaultLocale;
        };
        this.renderTimePicker = (locale) => (<ConfigConsumer>
      {({ getPopupContainer: getContextPopupContainer, getPrefixCls }) => {
            const _a = this.props, { getPopupContainer, prefixCls: customizePrefixCls, className, addon, placeholder } = _a, props = __rest(_a, ["getPopupContainer", "prefixCls", "className", "addon", "placeholder"]);
            const { size } = props;
            const pickerProps = omit(props, ['defaultValue', 'suffixIcon', 'allowEmpty', 'allowClear']);
            const format = this.getDefaultFormat();
            const prefixCls = getPrefixCls('time-picker', customizePrefixCls);
            const pickerClassName = classNames(className, {
                [`${prefixCls}-${size}`]: !!size,
            });
            const pickerAddon = (panel) => addon ? <div className={`${prefixCls}-panel-addon`}>{addon(panel)}</div> : null;
            return (<RcTimePicker {...generateShowHourMinuteSecond(format)} {...pickerProps} allowEmpty={this.getAllowClear()} prefixCls={prefixCls} getPopupContainer={getPopupContainer || getContextPopupContainer} ref={this.saveTimePicker} format={format} className={pickerClassName} value={this.state.value} placeholder={placeholder === undefined ? locale.placeholder : placeholder} onChange={this.handleChange} onOpen={this.handleOpenClose} onClose={this.handleOpenClose} addon={pickerAddon} inputIcon={this.renderInputIcon(prefixCls)} clearIcon={this.renderClearIcon(prefixCls)}/>);
        }}
    </ConfigConsumer>);
        const value = props.value || props.defaultValue;
        if (value && !interopDefault(moment).isMoment(value)) {
            throw new Error('The value/defaultValue of TimePicker must be a moment object after `antd@2.0`, ' +
                'see: https://u.ant.design/time-picker-value');
        }
        this.state = {
            value,
        };
        warning(!('allowEmpty' in props), 'TimePicker', '`allowEmpty` is deprecated. Please use `allowClear` instead.');
    }
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return { value: nextProps.value };
        }
        return null;
    }
    focus() {
        this.timePickerRef.focus();
    }
    blur() {
        this.timePickerRef.blur();
    }
    getDefaultFormat() {
        const { format, use12Hours } = this.props;
        if (format) {
            return format;
        }
        else if (use12Hours) {
            return 'h:mm:ss a';
        }
        return 'HH:mm:ss';
    }
    getAllowClear() {
        const { allowClear, allowEmpty } = this.props;
        if ('allowClear' in this.props) {
            return allowClear;
        }
        return allowEmpty;
    }
    renderInputIcon(prefixCls) {
        const { suffixIcon } = this.props;
        const clockIcon = (suffixIcon &&
            (React.isValidElement(suffixIcon) &&
                React.cloneElement(suffixIcon, {
                    className: classNames(suffixIcon.props.className, `${prefixCls}-clock-icon`),
                }))) || <Icon type="clock-circle" className={`${prefixCls}-clock-icon`}/>;
        return <span className={`${prefixCls}-icon`}>{clockIcon}</span>;
    }
    renderClearIcon(prefixCls) {
        const { clearIcon } = this.props;
        const clearIconPrefixCls = `${prefixCls}-clear`;
        if (clearIcon && React.isValidElement(clearIcon)) {
            return React.cloneElement(clearIcon, {
                className: classNames(clearIcon.props.className, clearIconPrefixCls),
            });
        }
        return <Icon type="close-circle" className={clearIconPrefixCls} theme="filled"/>;
    }
    render() {
        return (<LocaleReceiver componentName="TimePicker" defaultLocale={this.getDefaultLocale()}>
        {this.renderTimePicker}
      </LocaleReceiver>);
    }
}
TimePicker.defaultProps = {
    align: {
        offset: [0, -2],
    },
    disabled: false,
    disabledHours: undefined,
    disabledMinutes: undefined,
    disabledSeconds: undefined,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    transitionName: 'slide-up',
    focusOnOpen: true,
};
polyfill(TimePicker);
export default TimePicker;
