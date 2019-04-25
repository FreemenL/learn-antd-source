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
import Input from './Input';
import Icon from '../icon';
const ActionMap = {
    click: 'onClick',
    hover: 'onMouseOver',
};
export default class Password extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
        };
        this.onChange = () => {
            this.setState({
                visible: !this.state.visible,
            });
        };
    }
    getIcon() {
        const { prefixCls, action } = this.props;
        const iconTrigger = ActionMap[action] || '';
        const iconProps = {
            [iconTrigger]: this.onChange,
            className: `${prefixCls}-icon`,
            type: this.state.visible ? 'eye' : 'eye-invisible',
            key: 'passwordIcon',
            onMouseDown: (e) => {
                // Prevent focused state lost
                // https://github.com/ant-design/ant-design/issues/15173
                e.preventDefault();
            },
        };
        return <Icon {...iconProps}/>;
    }
    render() {
        const _a = this.props, { className, prefixCls, inputPrefixCls, size, suffix, visibilityToggle } = _a, restProps = __rest(_a, ["className", "prefixCls", "inputPrefixCls", "size", "suffix", "visibilityToggle"]);
        const suffixIcon = visibilityToggle && this.getIcon();
        const inputClassName = classNames(prefixCls, className, {
            [`${prefixCls}-${size}`]: !!size,
        });
        return (<Input {...restProps} type={this.state.visible ? 'text' : 'password'} size={size} className={inputClassName} prefixCls={inputPrefixCls} suffix={suffixIcon}/>);
    }
}
Password.defaultProps = {
    inputPrefixCls: 'ant-input',
    prefixCls: 'ant-input-password',
    action: 'click',
    visibilityToggle: true,
};
