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
import Button from '../button';
import { ConfigConsumer } from '../config-provider';
export default class Search extends React.Component {
    constructor() {
        super(...arguments);
        this.onSearch = (e) => {
            const { onSearch } = this.props;
            if (onSearch) {
                onSearch(this.input.input.value, e);
            }
            this.input.focus();
        };
        this.saveInput = (node) => {
            this.input = node;
        };
        this.renderSuffix = (prefixCls) => {
            const { suffix, enterButton } = this.props;
            if (enterButton)
                return suffix;
            const node = (<Icon className={`${prefixCls}-icon`} type="search" key="searchIcon" onClick={this.onSearch}/>);
            if (suffix) {
                let cloneSuffix = suffix;
                if (React.isValidElement(cloneSuffix) && !cloneSuffix.key) {
                    cloneSuffix = React.cloneElement(cloneSuffix, {
                        key: 'originSuffix',
                    });
                }
                return [cloneSuffix, node];
            }
            return node;
        };
        this.renderAddonAfter = (prefixCls) => {
            const { enterButton, size, disabled, addonAfter } = this.props;
            if (!enterButton)
                return addonAfter;
            const btnClassName = `${prefixCls}-button`;
            let button;
            const enterButtonAsElement = enterButton;
            if (enterButtonAsElement.type === Button || enterButtonAsElement.type === 'button') {
                button = React.cloneElement(enterButtonAsElement, Object.assign({ onClick: this.onSearch, key: 'enterButton' }, (enterButtonAsElement.type === Button
                    ? {
                        className: btnClassName,
                        size,
                    }
                    : {})));
            }
            else {
                button = (<Button className={btnClassName} type="primary" size={size} disabled={disabled} key="enterButton" onClick={this.onSearch}>
          {enterButton === true ? <Icon type="search"/> : enterButton}
        </Button>);
            }
            if (addonAfter) {
                return [button, addonAfter];
            }
            return button;
        };
        this.renderSearch = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls: customizePrefixCls, inputPrefixCls: customizeInputPrefixCls, size, enterButton, className } = _a, restProps = __rest(_a, ["prefixCls", "inputPrefixCls", "size", "enterButton", "className"]);
            delete restProps.onSearch;
            const prefixCls = getPrefixCls('input-search', customizePrefixCls);
            const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);
            let inputClassName;
            if (enterButton) {
                inputClassName = classNames(prefixCls, className, {
                    [`${prefixCls}-enter-button`]: !!enterButton,
                    [`${prefixCls}-${size}`]: !!size,
                });
            }
            else {
                inputClassName = classNames(prefixCls, className);
            }
            return (<Input onPressEnter={this.onSearch} {...restProps} size={size} prefixCls={inputPrefixCls} addonAfter={this.renderAddonAfter(prefixCls)} suffix={this.renderSuffix(prefixCls)} ref={this.saveInput} className={inputClassName}/>);
        };
    }
    focus() {
        this.input.focus();
    }
    blur() {
        this.input.blur();
    }
    render() {
        return <ConfigConsumer>{this.renderSearch}</ConfigConsumer>;
    }
}
Search.defaultProps = {
    enterButton: false,
};
