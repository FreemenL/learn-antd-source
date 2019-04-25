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
const Typography = (_a) => {
    var { prefixCls: customizePrefixCls, component = 'article', className, ['aria-label']: ariaLabel, setContentRef, children } = _a, restProps = __rest(_a, ["prefixCls", "component", "className", 'aria-label', "setContentRef", "children"]);
    return (<ConfigConsumer>
    {({ getPrefixCls }) => {
        const Component = component;
        const prefixCls = getPrefixCls('typography', customizePrefixCls);
        return (<Component className={classNames(prefixCls, className)} aria-label={ariaLabel} ref={setContentRef} {...restProps}>
          {children}
        </Component>);
    }}
  </ConfigConsumer>);
};
export default Typography;
