import * as React from 'react';
import RcMenu, { Divider, ItemGroup } from 'rc-menu';
import createContext from 'create-react-context';
import classNames from 'classnames';
import omit from 'omit.js';
import SubMenu from './SubMenu';
import Item from './MenuItem';
import { ConfigConsumer } from '../config-provider';
import animation from '../_util/openAnimation';
import warning from '../_util/warning';
import { polyfill } from 'react-lifecycles-compat';
import { SiderContext } from '../layout/Sider';
import raf from '../_util/raf';
export const MenuContext = createContext({
    inlineCollapsed: false,
});
class InternalMenu extends React.Component {
    constructor(props) {
        super(props);
        // Restore vertical mode when menu is collapsed responsively when mounted
        // https://github.com/ant-design/ant-design/issues/13104
        // TODO: not a perfect solution, looking a new way to avoid setting switchingModeFromInline in this situation
        this.handleMouseEnter = (e) => {
            this.restoreModeVerticalFromInline();
            const { onMouseEnter } = this.props;
            if (onMouseEnter) {
                onMouseEnter(e);
            }
        };
        this.handleTransitionEnd = (e) => {
            // when inlineCollapsed menu width animation finished
            // https://github.com/ant-design/ant-design/issues/12864
            const widthCollapsed = e.propertyName === 'width' && e.target === e.currentTarget;
            // Fix SVGElement e.target.className.indexOf is not a function
            // https://github.com/ant-design/ant-design/issues/15699
            const { className } = e.target;
            // SVGAnimatedString.animVal should be identical to SVGAnimatedString.baseVal, unless during an animation.
            const classNameValue = Object.prototype.toString.call(className) === '[object SVGAnimatedString]'
                ? className.animVal
                : className;
            // Fix for <Menu style={{ width: '100%' }} />, the width transition won't trigger when menu is collapsed
            // https://github.com/ant-design/ant-design-pro/issues/2783
            const iconScaled = e.propertyName === 'font-size' && classNameValue.indexOf('anticon') >= 0;
            if (widthCollapsed || iconScaled) {
                this.restoreModeVerticalFromInline();
            }
        };
        this.handleClick = (e) => {
            this.handleOpenChange([]);
            const { onClick } = this.props;
            if (onClick) {
                onClick(e);
            }
        };
        this.handleOpenChange = (openKeys) => {
            this.setOpenKeys(openKeys);
            const { onOpenChange } = this.props;
            if (onOpenChange) {
                onOpenChange(openKeys);
            }
        };
        this.renderMenu = ({ getPopupContainer, getPrefixCls }) => {
            const { mounted } = this.state;
            const { prefixCls: customizePrefixCls, className, theme, collapsedWidth } = this.props;
            const passProps = omit(this.props, ['collapsedWidth', 'siderCollapsed']);
            const menuMode = this.getRealMenuMode();
            const menuOpenAnimation = this.getMenuOpenAnimation(menuMode);
            const prefixCls = getPrefixCls('menu', customizePrefixCls);
            const menuClassName = classNames(className, `${prefixCls}-${theme}`, {
                [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed(),
            });
            const menuProps = {
                openKeys: this.state.openKeys,
                onOpenChange: this.handleOpenChange,
                className: menuClassName,
                mode: menuMode,
            };
            if (menuMode !== 'inline') {
                // closing vertical popup submenu after click it
                menuProps.onClick = this.handleClick;
                menuProps.openTransitionName = mounted ? menuOpenAnimation : '';
            }
            else {
                menuProps.openAnimation = mounted ? menuOpenAnimation : {};
            }
            // https://github.com/ant-design/ant-design/issues/8587
            if (this.getInlineCollapsed() &&
                (collapsedWidth === 0 || collapsedWidth === '0' || collapsedWidth === '0px')) {
                return null;
            }
            return (<RcMenu getPopupContainer={getPopupContainer} {...passProps} {...menuProps} prefixCls={prefixCls} onTransitionEnd={this.handleTransitionEnd} onMouseEnter={this.handleMouseEnter}/>);
        };
        warning(!('onOpen' in props || 'onClose' in props), 'Menu', '`onOpen` and `onClose` are removed, please use `onOpenChange` instead, ' +
            'see: https://u.ant.design/menu-on-open-change.');
        warning(!('inlineCollapsed' in props && props.mode !== 'inline'), 'Menu', '`inlineCollapsed` should only be used when `mode` is inline.');
        let openKeys;
        if ('openKeys' in props) {
            openKeys = props.openKeys;
        }
        else if ('defaultOpenKeys' in props) {
            openKeys = props.defaultOpenKeys;
        }
        this.state = {
            openKeys: openKeys || [],
            switchingModeFromInline: false,
            inlineOpenKeys: [],
            prevProps: props,
            mounted: false,
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { prevProps } = prevState;
        const newState = {
            prevProps: nextProps,
        };
        if (prevProps.mode === 'inline' && nextProps.mode !== 'inline') {
            newState.switchingModeFromInline = true;
        }
        if ('openKeys' in nextProps) {
            newState.openKeys = nextProps.openKeys;
        }
        else {
            // [Legacy] Old code will return after `openKeys` changed.
            // Not sure the reason, we should keep this logic still.
            if ((nextProps.inlineCollapsed && !prevProps.inlineCollapsed) ||
                (nextProps.siderCollapsed && !prevProps.siderCollapsed)) {
                newState.switchingModeFromInline = true;
                newState.inlineOpenKeys = prevState.openKeys;
                newState.openKeys = [];
            }
            if ((!nextProps.inlineCollapsed && prevProps.inlineCollapsed) ||
                (!nextProps.siderCollapsed && prevProps.siderCollapsed)) {
                newState.openKeys = prevState.inlineOpenKeys;
                newState.inlineOpenKeys = [];
            }
        }
        return newState;
    }
    // [Legacy] Origin code can render full defaultOpenKeys is caused by `rc-animate` bug.
    // We have to workaround this to prevent animation on first render.
    // https://github.com/ant-design/ant-design/issues/15966
    componentDidMount() {
        this.mountRafId = raf(() => {
            this.setState({
                mounted: true,
            });
        }, 10);
    }
    componentWillUnmount() {
        raf.cancel(this.mountRafId);
    }
    restoreModeVerticalFromInline() {
        const { switchingModeFromInline } = this.state;
        if (switchingModeFromInline) {
            this.setState({
                switchingModeFromInline: false,
            });
        }
    }
    setOpenKeys(openKeys) {
        if (!('openKeys' in this.props)) {
            this.setState({ openKeys });
        }
    }
    getRealMenuMode() {
        const inlineCollapsed = this.getInlineCollapsed();
        if (this.state.switchingModeFromInline && inlineCollapsed) {
            return 'inline';
        }
        const { mode } = this.props;
        return inlineCollapsed ? 'vertical' : mode;
    }
    getInlineCollapsed() {
        const { inlineCollapsed } = this.props;
        if (this.props.siderCollapsed !== undefined) {
            return this.props.siderCollapsed;
        }
        return inlineCollapsed;
    }
    getMenuOpenAnimation(menuMode) {
        const { openAnimation, openTransitionName } = this.props;
        let menuOpenAnimation = openAnimation || openTransitionName;
        if (openAnimation === undefined && openTransitionName === undefined) {
            if (menuMode === 'horizontal') {
                menuOpenAnimation = 'slide-up';
            }
            else if (menuMode === 'inline') {
                menuOpenAnimation = animation;
            }
            else {
                // When mode switch from inline
                // submenu should hide without animation
                if (this.state.switchingModeFromInline) {
                    menuOpenAnimation = '';
                    this.setState({
                        switchingModeFromInline: false,
                    });
                    // this.switchingModeFromInline = false;
                }
                else {
                    menuOpenAnimation = 'zoom-big';
                }
            }
        }
        return menuOpenAnimation;
    }
    render() {
        return (<MenuContext.Provider value={{
            inlineCollapsed: this.getInlineCollapsed() || false,
            antdMenuTheme: this.props.theme,
        }}>
        <ConfigConsumer>{this.renderMenu}</ConfigConsumer>
      </MenuContext.Provider>);
    }
}
InternalMenu.defaultProps = {
    className: '',
    theme: 'light',
    focusable: false,
};
polyfill(InternalMenu);
// We should keep this as ref-able
export default class Menu extends React.Component {
    render() {
        return (<SiderContext.Consumer>
        {(context) => <InternalMenu {...this.props} {...context}/>}
      </SiderContext.Consumer>);
    }
}
Menu.Divider = Divider;
Menu.Item = Item;
Menu.SubMenu = SubMenu;
Menu.ItemGroup = ItemGroup;
