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
import RcSlider from 'rc-slider/lib/Slider';
import RcRange from 'rc-slider/lib/Range';
import RcHandle from 'rc-slider/lib/Handle';
import Tooltip from '../tooltip';
import { ConfigConsumer } from '../config-provider';
export default class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.toggleTooltipVisible = (index, visible) => {
            this.setState(({ visibles }) => ({
                visibles: Object.assign({}, visibles, { [index]: visible }),
            }));
        };
        this.handleWithTooltip = (tooltipPrefixCls, _a) => {
            var { value, dragging, index } = _a, restProps = __rest(_a, ["value", "dragging", "index"]);
            const { tipFormatter, tooltipVisible } = this.props;
            const { visibles } = this.state;
            const isTipFormatter = tipFormatter ? visibles[index] || dragging : false;
            const visible = tooltipVisible || (tooltipVisible === undefined && isTipFormatter);
            return (<Tooltip prefixCls={tooltipPrefixCls} title={tipFormatter ? tipFormatter(value) : ''} visible={visible} placement="top" transitionName="zoom-down" key={index}>
        <RcHandle {...restProps} value={value} onMouseEnter={() => this.toggleTooltipVisible(index, true)} onMouseLeave={() => this.toggleTooltipVisible(index, false)}/>
      </Tooltip>);
        };
        this.saveSlider = (node) => {
            this.rcSlider = node;
        };
        this.renderSlider = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls: customizePrefixCls, tooltipPrefixCls: customizeTooltipPrefixCls, range } = _a, restProps = __rest(_a, ["prefixCls", "tooltipPrefixCls", "range"]);
            const prefixCls = getPrefixCls('slider', customizePrefixCls);
            const tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);
            if (range) {
                return (<RcRange {...restProps} ref={this.saveSlider} handle={(info) => this.handleWithTooltip(tooltipPrefixCls, info)} prefixCls={prefixCls} tooltipPrefixCls={tooltipPrefixCls}/>);
            }
            return (<RcSlider {...restProps} ref={this.saveSlider} handle={(info) => this.handleWithTooltip(tooltipPrefixCls, info)} prefixCls={prefixCls} tooltipPrefixCls={tooltipPrefixCls}/>);
        };
        this.state = {
            visibles: {},
        };
    }
    focus() {
        this.rcSlider.focus();
    }
    blur() {
        this.rcSlider.blur();
    }
    render() {
        return <ConfigConsumer>{this.renderSlider}</ConfigConsumer>;
    }
}
Slider.defaultProps = {
    tipFormatter(value) {
        return value.toString();
    },
};
