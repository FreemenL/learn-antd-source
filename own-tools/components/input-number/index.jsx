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
import classNames from 'classnames';
import RcInputNumber from 'rc-input-number';
import Icon from '../icon';
import { ConfigConsumer } from '../config-provider';
export default class InputNumber extends React.Component {
    constructor() {
        super(...arguments);
        this.saveInputNumber = (inputNumberRef) => {
            this.inputNumberRef = inputNumberRef;
        };
        this.renderInputNumber = ({ getPrefixCls }) => {
            const _a = this.props, { className, size, prefixCls: customizePrefixCls } = _a, others = __rest(_a, ["className", "size", "prefixCls"]);
            const prefixCls = getPrefixCls('input-number', customizePrefixCls);
            const inputNumberClass = classNames({
                [`${prefixCls}-lg`]: size === 'large',
                [`${prefixCls}-sm`]: size === 'small',
            }, className);
            const upIcon = <Icon type="up" className={`${prefixCls}-handler-up-inner`}/>;
            const downIcon = <Icon type="down" className={`${prefixCls}-handler-down-inner`}/>;
            return (<RcInputNumber ref={this.saveInputNumber} className={inputNumberClass} upHandler={upIcon} downHandler={downIcon} prefixCls={prefixCls} {...others}/>);
        };
    }
    focus() {
        this.inputNumberRef.focus();
    }
    blur() {
        this.inputNumberRef.blur();
    }
    render() {
        return <ConfigConsumer>{this.renderInputNumber}</ConfigConsumer>;
    }
}
InputNumber.defaultProps = {
    step: 1,
};
