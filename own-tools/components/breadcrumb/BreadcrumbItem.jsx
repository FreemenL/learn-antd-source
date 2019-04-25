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
import * as PropTypes from 'prop-types';
import { ConfigConsumer } from '../config-provider';
export default class BreadcrumbItem extends React.Component {
    constructor() {
        super(...arguments);
        this.renderBreadcrumbItem = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls: customizePrefixCls, separator, children } = _a, restProps = __rest(_a, ["prefixCls", "separator", "children"]);
            const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
            let link;
            if ('href' in this.props) {
                link = (<a className={`${prefixCls}-link`} {...restProps}>
          {children}
        </a>);
            }
            else {
                link = (<span className={`${prefixCls}-link`} {...restProps}>
          {children}
        </span>);
            }
            if (children) {
                return (<span>
          {link}
          <span className={`${prefixCls}-separator`}>{separator}</span>
        </span>);
            }
            return null;
        };
    }
    render() {
        return <ConfigConsumer>{this.renderBreadcrumbItem}</ConfigConsumer>;
    }
}
BreadcrumbItem.__ANT_BREADCRUMB_ITEM = true;
BreadcrumbItem.defaultProps = {
    separator: '/',
};
BreadcrumbItem.propTypes = {
    prefixCls: PropTypes.string,
    separator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    href: PropTypes.string,
};
