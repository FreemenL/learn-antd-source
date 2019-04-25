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
import warning from '../_util/warning';
import Base from './Base';
const Text = (_a) => {
    var { ellipsis } = _a, restProps = __rest(_a, ["ellipsis"]);
    warning(typeof ellipsis !== 'object', 'Typography.Text', '`ellipsis` is only support boolean value.');
    return <Base {...restProps} ellipsis={!!ellipsis} component="span"/>;
};
export default Text;
