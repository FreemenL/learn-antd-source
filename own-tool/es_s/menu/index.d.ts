import * as React from 'react';
import { Context } from '@ant-design/create-react-context';
import SubMenu from './SubMenu';
import Item from './MenuItem';
import { SiderContextProps } from '../layout/Sider';
export interface SelectParam {
    key: string;
    keyPath: Array<string>;
    item: any;
    domEvent: any;
    selectedKeys: Array<string>;
}
export interface ClickParam {
    key: string;
    keyPath: Array<string>;
    item: any;
    domEvent: any;
}
export declare type MenuMode = 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | 'inline';
export declare type MenuTheme = 'light' | 'dark';
export interface MenuProps {
    id?: string;
    theme?: MenuTheme;
    mode?: MenuMode;
    selectable?: boolean;
    selectedKeys?: Array<string>;
    defaultSelectedKeys?: Array<string>;
    openKeys?: Array<string>;
    defaultOpenKeys?: Array<string>;
    onOpenChange?: (openKeys: string[]) => void;
    onSelect?: (param: SelectParam) => void;
    onDeselect?: (param: SelectParam) => void;
    onClick?: (param: ClickParam) => void;
    style?: React.CSSProperties;
    openAnimation?: string | Object;
    openTransitionName?: string | Object;
    className?: string;
    prefixCls?: string;
    multiple?: boolean;
    inlineIndent?: number;
    inlineCollapsed?: boolean;
    subMenuCloseDelay?: number;
    subMenuOpenDelay?: number;
    focusable?: boolean;
    onMouseEnter?: (e: MouseEvent) => void;
    getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
    overflowedIndicator?: React.ReactNode;
}
declare type InternalMenuProps = MenuProps & SiderContextProps;
export interface MenuState {
    openKeys: string[];
    switchingModeFromInline: boolean;
    inlineOpenKeys: string[];
    prevProps: InternalMenuProps;
    mounted: boolean;
}
export interface MenuContextProps {
    inlineCollapsed: boolean;
    antdMenuTheme?: MenuTheme;
}
export declare const MenuContext: Context<MenuContextProps>;
export default class Menu extends React.Component<MenuProps, {}> {
    static Divider: any;
    static Item: typeof Item;
    static SubMenu: typeof SubMenu;
    static ItemGroup: any;
    render(): JSX.Element;
}
export {};
