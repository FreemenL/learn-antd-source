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
import Dialog from 'rc-dialog';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { getConfirmLocale } from './locale';
import Icon from '../icon';
import Button from '../button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { ConfigConsumer } from '../config-provider';
let mousePosition;
let mousePositionEventBinded;
export const destroyFns = [];
export default class Modal extends React.Component {
    constructor() {
        super(...arguments);
        this.handleCancel = (e) => {
            const onCancel = this.props.onCancel;
            if (onCancel) {
                onCancel(e);
            }
        };
        this.handleOk = (e) => {
            const onOk = this.props.onOk;
            if (onOk) {
                onOk(e);
            }
        };
        this.renderFooter = (locale) => {
            const { okText, okType, cancelText, confirmLoading } = this.props;
            return (<div>
        <Button onClick={this.handleCancel} {...this.props.cancelButtonProps}>
          {cancelText || locale.cancelText}
        </Button>
        <Button type={okType} loading={confirmLoading} onClick={this.handleOk} {...this.props.okButtonProps}>
          {okText || locale.okText}
        </Button>
      </div>);
        };
        this.renderModal = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls: customizePrefixCls, footer, visible, wrapClassName, centered } = _a, restProps = __rest(_a, ["prefixCls", "footer", "visible", "wrapClassName", "centered"]);
            const prefixCls = getPrefixCls('modal', customizePrefixCls);
            const defaultFooter = (<LocaleReceiver componentName="Modal" defaultLocale={getConfirmLocale()}>
        {this.renderFooter}
      </LocaleReceiver>);
            const closeIcon = (<span className={`${prefixCls}-close-x`}>
        <Icon className={`${prefixCls}-close-icon`} type={'close'}/>
      </span>);
            return (<Dialog {...restProps} prefixCls={prefixCls} wrapClassName={classNames({ [`${prefixCls}-centered`]: !!centered }, wrapClassName)} footer={footer === undefined ? defaultFooter : footer} visible={visible} mousePosition={mousePosition} onClose={this.handleCancel} closeIcon={closeIcon}/>);
        };
    }
    componentDidMount() {
        if (mousePositionEventBinded) {
            return;
        }
        // 只有点击事件支持从鼠标位置动画展开
        addEventListener(document.documentElement, 'click', (e) => {
            mousePosition = {
                x: e.pageX,
                y: e.pageY,
            };
            // 100ms 内发生过点击事件，则从点击位置动画展示
            // 否则直接 zoom 展示
            // 这样可以兼容非点击方式展开
            setTimeout(() => (mousePosition = null), 100);
        });
        mousePositionEventBinded = true;
    }
    render() {
        return <ConfigConsumer>{this.renderModal}</ConfigConsumer>;
    }
}
Modal.defaultProps = {
    width: 520,
    transitionName: 'zoom',
    maskTransitionName: 'fade',
    confirmLoading: false,
    visible: false,
    okType: 'primary',
    okButtonDisabled: false,
    cancelButtonDisabled: false,
};
Modal.propTypes = {
    prefixCls: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    okText: PropTypes.node,
    cancelText: PropTypes.node,
    centered: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    confirmLoading: PropTypes.bool,
    visible: PropTypes.bool,
    align: PropTypes.object,
    footer: PropTypes.node,
    title: PropTypes.node,
    closable: PropTypes.bool,
};
