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
const Grid = props => (<ConfigConsumer>
    {({ getPrefixCls }) => {
    const { prefixCls: customizePrefixCls, className } = props, others = __rest(props, ["prefixCls", "className"]);
    const prefixCls = getPrefixCls('card', customizePrefixCls);
    const classString = classNames(`${prefixCls}-grid`, className);
    return <div {...others} className={classString}/>;
}}
  </ConfigConsumer>);
export default Grid;
