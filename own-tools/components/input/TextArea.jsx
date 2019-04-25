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
import omit from 'omit.js';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import calculateNodeHeight from './calculateNodeHeight';
import { ConfigConsumer } from '../config-provider';
import ResizeObserver from '../_util/resizeObserver';
function onNextFrame(cb) {
    if (window.requestAnimationFrame) {
        return window.requestAnimationFrame(cb);
    }
    return window.setTimeout(cb, 1);
}
function clearNextFrameAction(nextFrameId) {
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(nextFrameId);
    }
    else {
        window.clearTimeout(nextFrameId);
    }
}
class TextArea extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            textareaStyles: {},
        };
        this.resizeOnNextFrame = () => {
            if (this.nextFrameActionId) {
                clearNextFrameAction(this.nextFrameActionId);
            }
            this.nextFrameActionId = onNextFrame(this.resizeTextarea);
        };
        this.resizeTextarea = () => {
            const { autosize } = this.props;
            if (!autosize || !this.textAreaRef) {
                return;
            }
            const { minRows, maxRows } = autosize;
            const textareaStyles = calculateNodeHeight(this.textAreaRef, false, minRows, maxRows);
            this.setState({ textareaStyles });
        };
        this.handleTextareaChange = (e) => {
            if (!('value' in this.props)) {
                this.resizeTextarea();
            }
            const { onChange } = this.props;
            if (onChange) {
                onChange(e);
            }
        };
        this.handleKeyDown = (e) => {
            const { onPressEnter, onKeyDown } = this.props;
            if (e.keyCode === 13 && onPressEnter) {
                onPressEnter(e);
            }
            if (onKeyDown) {
                onKeyDown(e);
            }
        };
        this.saveTextAreaRef = (textArea) => {
            this.textAreaRef = textArea;
        };
        this.renderTextArea = ({ getPrefixCls }) => {
            const { prefixCls: customizePrefixCls, className, disabled, autosize } = this.props;
            const props = __rest(this.props, []);
            const otherProps = omit(props, ['prefixCls', 'onPressEnter', 'autosize']);
            const prefixCls = getPrefixCls('input', customizePrefixCls);
            const cls = classNames(prefixCls, className, {
                [`${prefixCls}-disabled`]: disabled,
            });
            const style = Object.assign({}, props.style, this.state.textareaStyles);
            // Fix https://github.com/ant-design/ant-design/issues/6776
            // Make sure it could be reset when using form.getFieldDecorator
            if ('value' in otherProps) {
                otherProps.value = otherProps.value || '';
            }
            return (<ResizeObserver onResize={this.resizeOnNextFrame} disabled={!autosize}>
        <textarea {...otherProps} className={cls} style={style} onKeyDown={this.handleKeyDown} onChange={this.handleTextareaChange} ref={this.saveTextAreaRef}/>
      </ResizeObserver>);
        };
    }
    componentDidMount() {
        this.resizeTextarea();
    }
    componentDidUpdate(prevProps) {
        // Re-render with the new content then recalculate the height as required.
        if (prevProps.value !== this.props.value) {
            this.resizeOnNextFrame();
        }
    }
    focus() {
        this.textAreaRef.focus();
    }
    blur() {
        this.textAreaRef.blur();
    }
    render() {
        return <ConfigConsumer>{this.renderTextArea}</ConfigConsumer>;
    }
}
polyfill(TextArea);
export default TextArea;
