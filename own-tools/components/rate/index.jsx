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
import RcRate from 'rc-rate';
import omit from 'omit.js';
import Icon from '../icon';
import Tooltip from '../tooltip';
import { ConfigConsumer } from '../config-provider';
export default class Rate extends React.Component {
    constructor() {
        super(...arguments);
        this.saveRate = (node) => {
            this.rcRate = node;
        };
        this.characterRender = (node, { index }) => {
            const { tooltips } = this.props;
            if (!tooltips)
                return node;
            return <Tooltip title={tooltips[index]}>{node}</Tooltip>;
        };
        this.renderRate = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls } = _a, restProps = __rest(_a, ["prefixCls"]);
            const rateProps = omit(restProps, ['tooltips']);
            return (<RcRate ref={this.saveRate} characterRender={this.characterRender} {...rateProps} prefixCls={getPrefixCls('rate', prefixCls)}/>);
        };
    }
    focus() {
        this.rcRate.focus();
    }
    blur() {
        this.rcRate.blur();
    }
    render() {
        return <ConfigConsumer>{this.renderRate}</ConfigConsumer>;
    }
}
Rate.propTypes = {
    prefixCls: PropTypes.string,
    character: PropTypes.node,
};
Rate.defaultProps = {
    character: <Icon type="star" theme="filled"/>,
};
