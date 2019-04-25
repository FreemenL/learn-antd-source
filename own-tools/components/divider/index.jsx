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
import { ConfigConsumer } from '../config-provider';
const Divider = props => (<ConfigConsumer>
    {({ getPrefixCls }) => {
    const { prefixCls: customizePrefixCls, type = 'horizontal', orientation = '', className, children, dashed } = props, restProps = __rest(props, ["prefixCls", "type", "orientation", "className", "children", "dashed"]);
    const prefixCls = getPrefixCls('divider', customizePrefixCls);
    const orientationPrefix = orientation.length > 0 ? '-' + orientation : orientation;
    const classString = classNames(className, prefixCls, `${prefixCls}-${type}`, {
        [`${prefixCls}-with-text${orientationPrefix}`]: children,
        [`${prefixCls}-dashed`]: !!dashed,
    });
    return (<div className={classString} {...restProps}>
          {children && <span className={`${prefixCls}-inner-text`}>{children}</span>}
        </div>);
}}
  </ConfigConsumer>);
export default Divider;
