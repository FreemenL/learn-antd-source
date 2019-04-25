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
import warning from 'warning';
import Base from './Base';
import { tupleNum } from '../_util/type';
const TITLE_ELE_LIST = tupleNum(1, 2, 3, 4);
const Title = props => {
    const { level = 1 } = props, restProps = __rest(props, ["level"]);
    let component;
    if (TITLE_ELE_LIST.indexOf(level) !== -1) {
        component = `h${level}`;
    }
    else {
        warning(false, 'Title only accept `1 | 2 | 3 | 4` as `level` value.');
        component = 'h1';
    }
    return <Base {...restProps} component={component}/>;
};
export default Title;
