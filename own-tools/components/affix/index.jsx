var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import omit from 'omit.js';
import { ConfigConsumer } from '../config-provider';
import { throttleByAnimationFrameDecorator } from '../_util/throttleByAnimationFrame';
import ResizeObserver from '../_util/resizeObserver';
import warning from '../_util/warning';
import { addObserveTarget, removeObserveTarget, getTargetRect } from './utils';
function getDefaultTarget() {
    return typeof window !== 'undefined' ? window : null;
}
var AffixStatus;
(function (AffixStatus) {
    AffixStatus[AffixStatus["None"] = 0] = "None";
    AffixStatus[AffixStatus["Prepare"] = 1] = "Prepare";
})(AffixStatus || (AffixStatus = {}));
class Affix extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            status: AffixStatus.None,
            lastAffix: false,
        };
        this.savePlaceholderNode = (node) => {
            this.placeholderNode = node;
        };
        this.saveFixedNode = (node) => {
            this.fixedNode = node;
        };
        this.measure = () => {
            const { status, lastAffix } = this.state;
            const { target, offset, offsetBottom, onChange } = this.props;
            if (status !== AffixStatus.Prepare || !this.fixedNode || !this.placeholderNode || !target) {
                return;
            }
            let { offsetTop } = this.props;
            if (typeof offsetTop === 'undefined') {
                offsetTop = offset;
                warning(typeof offset === 'undefined', 'Affix', '`offset` is deprecated. Please use `offsetTop` instead.');
            }
            if (offsetBottom === undefined && offsetTop === undefined) {
                offsetTop = 0;
            }
            const targetNode = target();
            if (!targetNode) {
                return;
            }
            const newState = {
                status: AffixStatus.None,
            };
            const targetRect = getTargetRect(targetNode);
            const placeholderReact = getTargetRect(this.placeholderNode);
            if (offsetTop !== undefined && targetRect.top > placeholderReact.top - offsetTop) {
                newState.affixStyle = {
                    position: 'fixed',
                    top: offsetTop + targetRect.top,
                    width: placeholderReact.width,
                    height: placeholderReact.height,
                };
                newState.placeholderStyle = {
                    width: placeholderReact.width,
                    height: placeholderReact.height,
                };
            }
            else if (offsetBottom !== undefined &&
                targetRect.bottom < placeholderReact.bottom + offsetBottom) {
                const targetBottomOffset = targetNode === window ? 0 : window.innerHeight - targetRect.bottom;
                newState.affixStyle = {
                    position: 'fixed',
                    bottom: offsetBottom + targetBottomOffset,
                    width: placeholderReact.width,
                    height: placeholderReact.height,
                };
                newState.placeholderStyle = {
                    width: placeholderReact.width,
                    height: placeholderReact.height,
                };
            }
            newState.lastAffix = !!newState.affixStyle;
            if (onChange && lastAffix !== newState.lastAffix) {
                onChange(newState.lastAffix);
            }
            this.setState(newState);
        };
        // =================== Render ===================
        this.renderAffix = ({ getPrefixCls }) => {
            const { affixStyle, placeholderStyle, status } = this.state;
            const { prefixCls, style, children } = this.props;
            const className = classNames({
                [getPrefixCls('affix', prefixCls)]: affixStyle,
            });
            let props = omit(this.props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target', 'onChange']);
            // Omit this since `onTestUpdatePosition` only works on test.
            if (process.env.NODE_ENV === 'test') {
                props = omit(props, ['onTestUpdatePosition']);
            }
            const mergedPlaceholderStyle = Object.assign({}, (status === AffixStatus.None ? placeholderStyle : null), style);
            return (<div {...props} style={mergedPlaceholderStyle} ref={this.savePlaceholderNode}>
        <div className={className} ref={this.saveFixedNode} style={this.state.affixStyle}>
          <ResizeObserver onResize={this.updatePosition}>{children}</ResizeObserver>
        </div>
      </div>);
        };
    }
    // Event handler
    componentDidMount() {
        const { target } = this.props;
        if (target) {
            // [Legacy] Wait for parent component ref has its value.
            // We should use target as directly element instead of function which makes element check hard.
            this.timeout = setTimeout(() => {
                addObserveTarget(target(), this);
                // Mock Event object.
                this.updatePosition({});
            });
        }
    }
    componentDidUpdate(prevProps) {
        const { target } = this.props;
        if (prevProps.target !== target) {
            removeObserveTarget(this);
            if (target) {
                addObserveTarget(target(), this);
                // Mock Event object.
                this.updatePosition({});
            }
        }
        if (prevProps.offsetTop !== this.props.offsetTop ||
            prevProps.offsetBottom !== this.props.offsetBottom) {
            this.updatePosition({});
        }
        this.measure();
    }
    componentWillUnmount() {
        clearTimeout(this.timeout);
        removeObserveTarget(this);
        this.updatePosition.cancel();
    }
    // =================== Measure ===================
    // Handle realign logic
    // @ts-ignore TS6133
    updatePosition(e) {
        // event param is used before. Keep compatible ts define here.
        this.setState({
            status: AffixStatus.Prepare,
            affixStyle: undefined,
            placeholderStyle: undefined,
        });
        // Test if `updatePosition` called
        if (process.env.NODE_ENV === 'test') {
            const { onTestUpdatePosition } = this.props;
            if (onTestUpdatePosition) {
                onTestUpdatePosition();
            }
        }
    }
    render() {
        return <ConfigConsumer>{this.renderAffix}</ConfigConsumer>;
    }
}
Affix.defaultProps = {
    target: getDefaultTarget,
};
__decorate([
    throttleByAnimationFrameDecorator()
], Affix.prototype, "updatePosition", null);
polyfill(Affix);
export default Affix;
