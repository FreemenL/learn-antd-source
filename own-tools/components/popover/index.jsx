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
import Tooltip from '../tooltip';
import { ConfigConsumer } from '../config-provider';
import warning from '../_util/warning';
export default class Popover extends React.Component {
    constructor() {
        super(...arguments);
        this.saveTooltip = (node) => {
            this.tooltip = node;
        };
        this.renderPopover = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls: customizePrefixCls } = _a, props = __rest(_a, ["prefixCls"]);
            delete props.title;
            const prefixCls = getPrefixCls('popover', customizePrefixCls);
            return (<Tooltip {...props} prefixCls={prefixCls} ref={this.saveTooltip} overlay={this.getOverlay(prefixCls)}/>);
        };
    }
    getPopupDomNode() {
        return this.tooltip.getPopupDomNode();
    }
    getOverlay(prefixCls) {
        const { title, content } = this.props;
        warning(!('overlay' in this.props), 'Popover', '`overlay` is removed, please use `content` instead, ' +
            'see: https://u.ant.design/popover-content');
        return (<div>
        {title && <div className={`${prefixCls}-title`}>{title}</div>}
        <div className={`${prefixCls}-inner-content`}>{content}</div>
      </div>);
    }
    render() {
        return <ConfigConsumer>{this.renderPopover}</ConfigConsumer>;
    }
}
Popover.defaultProps = {
    placement: 'top',
    transitionName: 'zoom-big',
    trigger: 'hover',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    overlayStyle: {},
};
