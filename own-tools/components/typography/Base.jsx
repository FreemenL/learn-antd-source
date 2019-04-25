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
import { polyfill } from 'react-lifecycles-compat';
import toArray from 'rc-util/lib/Children/toArray';
import copy from 'copy-to-clipboard';
import omit from 'omit.js';
import { withConfigConsumer, configConsumerProps } from '../config-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import warning from '../_util/warning';
import TransButton from '../_util/transButton';
import ResizeObserver from '../_util/resizeObserver';
import raf from '../_util/raf';
import isStyleSupport from '../_util/styleChecker';
import Icon from '../icon';
import Tooltip from '../tooltip';
import Typography from './Typography';
import Editable from './Editable';
import { measure } from './util';
const isLineClampSupport = isStyleSupport('webkitLineClamp');
const isTextOverflowSupport = isStyleSupport('textOverflow');
function wrapperDecorations({ mark, code, underline, delete: del, strong }, content) {
    let currentContent = content;
    function wrap(needed, tag) {
        if (!needed)
            return;
        currentContent = React.createElement(tag, {
            children: currentContent,
        });
    }
    wrap(strong, 'strong');
    wrap(underline, 'u');
    wrap(del, 'del');
    wrap(code, 'code');
    wrap(mark, 'mark');
    return currentContent;
}
const ELLIPSIS_STR = '...';
class Base extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            edit: false,
            copied: false,
            ellipsisText: '',
            ellipsisContent: null,
            isEllipsis: false,
            expanded: false,
            clientRendered: false,
        };
        // =============== Expend ===============
        this.onExpandClick = () => {
            const { onExpand } = this.getEllipsis();
            this.setState({ expanded: true });
            if (onExpand) {
                onExpand();
            }
        };
        // ================ Edit ================
        this.onEditClick = () => {
            this.triggerEdit(true);
        };
        this.onEditChange = (value) => {
            const { onChange } = this.getEditable();
            if (onChange) {
                onChange(value);
            }
            this.triggerEdit(false);
        };
        this.onEditCancel = () => {
            this.triggerEdit(false);
        };
        // ================ Copy ================
        this.onCopyClick = () => {
            const { children, copyable } = this.props;
            const copyConfig = Object.assign({}, (typeof copyable === 'object' ? copyable : null));
            if (copyConfig.text === undefined) {
                copyConfig.text = String(children);
            }
            copy(copyConfig.text || '');
            this.setState({ copied: true }, () => {
                if (copyConfig.onCopy) {
                    copyConfig.onCopy();
                }
                this.copyId = window.setTimeout(() => {
                    this.setState({ copied: false });
                }, 3000);
            });
        };
        this.setContentRef = (node) => {
            this.content = node;
        };
        this.setEditRef = (node) => {
            this.editIcon = node;
        };
        this.triggerEdit = (edit) => {
            const { onStart } = this.getEditable();
            if (edit && onStart) {
                onStart();
            }
            this.setState({ edit }, () => {
                if (!edit && this.editIcon) {
                    this.editIcon.focus();
                }
            });
        };
        // ============== Ellipsis ==============
        this.resizeOnNextFrame = () => {
            raf.cancel(this.rafId);
            this.rafId = raf(() => {
                // Do not bind `syncEllipsis`. It need for test usage on prototype
                this.syncEllipsis();
            });
        };
    }
    static getDerivedStateFromProps(nextProps) {
        const { children, editable } = nextProps;
        warning(!editable || typeof children === 'string', 'Typography', 'When `editable` is enabled, the `children` should use string.');
        return {};
    }
    componentDidMount() {
        this.setState({ clientRendered: true });
        this.resizeOnNextFrame();
    }
    componentDidUpdate(prevProps) {
        const ellipsis = this.getEllipsis();
        const prevEllipsis = this.getEllipsis(prevProps);
        if (this.props.children !== prevProps.children || ellipsis.rows !== prevEllipsis.rows) {
            this.resizeOnNextFrame();
        }
    }
    componentWillUnmount() {
        window.clearTimeout(this.copyId);
        raf.cancel(this.rafId);
    }
    getEditable(props) {
        const { edit } = this.state;
        const { editable } = props || this.props;
        if (!editable)
            return { editing: edit };
        return Object.assign({ editing: edit }, (typeof editable === 'object' ? editable : null));
    }
    getEllipsis(props) {
        const { ellipsis } = props || this.props;
        if (!ellipsis)
            return {};
        return Object.assign({ rows: 1, expandable: false }, (typeof ellipsis === 'object' ? ellipsis : null));
    }
    canUseCSSEllipsis() {
        const { clientRendered } = this.state;
        const { editable, copyable } = this.props;
        const { rows, expandable } = this.getEllipsis();
        // Can't use css ellipsis since we need to provide the place for button
        if (editable || copyable || expandable || !clientRendered) {
            return false;
        }
        if (rows === 1) {
            return isTextOverflowSupport;
        }
        return isLineClampSupport;
    }
    syncEllipsis() {
        const { ellipsisText, isEllipsis, expanded } = this.state;
        const { rows } = this.getEllipsis();
        const { children } = this.props;
        if (!rows || rows < 0 || !this.content || expanded)
            return;
        // Do not measure if css already support ellipsis
        if (this.canUseCSSEllipsis())
            return;
        warning(toArray(children).every((child) => typeof child === 'string'), 'Typography', '`ellipsis` should use string as children only.');
        const { content, text, ellipsis } = measure(this.content, rows, children, this.renderOperations(true), ELLIPSIS_STR);
        if (ellipsisText !== text || isEllipsis !== ellipsis) {
            this.setState({ ellipsisText: text, ellipsisContent: content, isEllipsis: ellipsis });
        }
    }
    renderExpand(forceRender) {
        const { expandable } = this.getEllipsis();
        const { prefixCls } = this.props;
        const { expanded, isEllipsis } = this.state;
        if (!expandable)
            return null;
        // force render expand icon for measure usage or it will cause dead loop
        if (!forceRender && (expanded || !isEllipsis))
            return null;
        return (<a key="expand" className={`${prefixCls}-expand`} onClick={this.onExpandClick} aria-label={this.expandStr}>
        {this.expandStr}
      </a>);
    }
    renderEdit() {
        const { editable, prefixCls } = this.props;
        if (!editable)
            return;
        return (<Tooltip key="edit" title={this.editStr}>
        <TransButton ref={this.setEditRef} className={`${prefixCls}-edit`} onClick={this.onEditClick} aria-label={this.editStr}>
          <Icon role="button" type="edit"/>
        </TransButton>
      </Tooltip>);
    }
    renderCopy() {
        const { copied } = this.state;
        const { copyable, prefixCls } = this.props;
        if (!copyable)
            return;
        const title = copied ? this.copiedStr : this.copyStr;
        return (<Tooltip key="copy" title={title}>
        <TransButton className={classNames(`${prefixCls}-copy`, copied && `${prefixCls}-copy-success`)} onClick={this.onCopyClick} aria-label={title}>
          <Icon role="button" type={copied ? 'check' : 'copy'}/>
        </TransButton>
      </Tooltip>);
    }
    renderEditInput() {
        const { children, prefixCls } = this.props;
        return (<Editable value={typeof children === 'string' ? children : ''} onSave={this.onEditChange} onCancel={this.onEditCancel} prefixCls={prefixCls}/>);
    }
    renderOperations(forceRenderExpanded) {
        return [this.renderExpand(forceRenderExpanded), this.renderEdit(), this.renderCopy()].filter(node => node);
    }
    renderContent() {
        const { ellipsisContent, isEllipsis, expanded } = this.state;
        const _a = this.props, { component, children, className, prefixCls, type, disabled, style } = _a, restProps = __rest(_a, ["component", "children", "className", "prefixCls", "type", "disabled", "style"]);
        const { rows } = this.getEllipsis();
        const textProps = omit(restProps, [
            'prefixCls',
            'editable',
            'copyable',
            'ellipsis',
            'mark',
            'underline',
            'mark',
            'code',
            'delete',
            'underline',
            'strong',
            ...configConsumerProps,
        ]);
        const cssEllipsis = this.canUseCSSEllipsis();
        const cssTextOverflow = rows === 1 && cssEllipsis;
        const cssLineClamp = rows && rows > 1 && cssEllipsis;
        let textNode = children;
        let ariaLabel = null;
        // Only use js ellipsis when css ellipsis not support
        if (rows && isEllipsis && !expanded && !cssEllipsis) {
            ariaLabel = String(children);
            // We move full content to outer element to avoid repeat read the content by accessibility
            textNode = (<span title={String(children)} aria-hidden="true">
          {ellipsisContent}
          {ELLIPSIS_STR}
        </span>);
        }
        textNode = wrapperDecorations(this.props, textNode);
        return (<LocaleReceiver componentName="Text">
        {({ edit, copy: copyStr, copied, expand }) => {
            this.editStr = edit;
            this.copyStr = copyStr;
            this.copiedStr = copied;
            this.expandStr = expand;
            return (<ResizeObserver onResize={this.resizeOnNextFrame} disabled={!rows}>
              <Typography className={classNames(className, {
                [`${prefixCls}-${type}`]: type,
                [`${prefixCls}-disabled`]: disabled,
                [`${prefixCls}-ellipsis`]: rows,
                [`${prefixCls}-ellipsis-single-line`]: cssTextOverflow,
                [`${prefixCls}-ellipsis-multiple-line`]: cssLineClamp,
            })} style={Object.assign({}, style, { WebkitLineClamp: cssLineClamp ? rows : null })} component={component} setContentRef={this.setContentRef} aria-label={ariaLabel} {...textProps}>
                {textNode}
                {this.renderOperations()}
              </Typography>
            </ResizeObserver>);
        }}
      </LocaleReceiver>);
    }
    render() {
        const { editing } = this.getEditable();
        if (editing) {
            return this.renderEditInput();
        }
        return this.renderContent();
    }
}
Base.defaultProps = {
    children: '',
};
polyfill(Base);
export default withConfigConsumer({
    prefixCls: 'typography',
})(Base);
