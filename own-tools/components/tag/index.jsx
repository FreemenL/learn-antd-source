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
import omit from 'omit.js';
import { polyfill } from 'react-lifecycles-compat';
import Icon from '../icon';
import CheckableTag from './CheckableTag';
import { ConfigConsumer } from '../config-provider';
import { PresetColorTypes } from '../_util/colors';
import Wave from '../_util/wave';
import warning from '../_util/warning';
const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);
class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
        this.handleIconClick = (e) => {
            this.setVisible(false, e);
        };
        this.renderTag = (configProps) => {
            const _a = this.props, { prefixCls: customizePrefixCls, children } = _a, otherProps = __rest(_a, ["prefixCls", "children"]);
            const divProps = omit(otherProps, ['onClose', 'afterClose', 'color', 'visible', 'closable']);
            return (<Wave>
        <div {...divProps} className={this.getTagClassName(configProps)} style={this.getTagStyle()}>
          {children}
          {this.renderCloseIcon()}
        </div>
      </Wave>);
        };
        warning(!('afterClose' in props), 'Tag', "'afterClose' will be deprecated, please use 'onClose', we will remove this in the next version.");
    }
    static getDerivedStateFromProps(nextProps) {
        if ('visible' in nextProps) {
            return {
                visible: nextProps.visible,
            };
        }
        return null;
    }
    setVisible(visible, e) {
        const { onClose, afterClose } = this.props;
        if (onClose) {
            onClose(e);
        }
        if (afterClose && !onClose) {
            // next version remove.
            afterClose();
        }
        if (e.defaultPrevented) {
            return;
        }
        if (!('visible' in this.props)) {
            this.setState({ visible });
        }
    }
    isPresetColor(color) {
        if (!color) {
            return false;
        }
        return PresetColorRegex.test(color);
    }
    getTagStyle() {
        const { color, style } = this.props;
        const isPresetColor = this.isPresetColor(color);
        return Object.assign({ backgroundColor: color && !isPresetColor ? color : undefined }, style);
    }
    getTagClassName({ getPrefixCls }) {
        const { prefixCls: customizePrefixCls, className, color } = this.props;
        const { visible } = this.state;
        const isPresetColor = this.isPresetColor(color);
        const prefixCls = getPrefixCls('tag', customizePrefixCls);
        return classNames(prefixCls, {
            [`${prefixCls}-${color}`]: isPresetColor,
            [`${prefixCls}-has-color`]: color && !isPresetColor,
            [`${prefixCls}-hidden`]: !visible,
        }, className);
    }
    renderCloseIcon() {
        const { closable } = this.props;
        return closable ? <Icon type="close" onClick={this.handleIconClick}/> : null;
    }
    render() {
        return <ConfigConsumer>{this.renderTag}</ConfigConsumer>;
    }
}
Tag.CheckableTag = CheckableTag;
Tag.defaultProps = {
    closable: false,
};
polyfill(Tag);
export default Tag;
