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
import { Item } from 'rc-menu';
import { MenuContext } from './';
import Tooltip from '../tooltip';
import { SiderContext } from '../layout/Sider';
export default class MenuItem extends React.Component {
    constructor() {
        super(...arguments);
        this.onKeyDown = (e) => {
            this.menuItem.onKeyDown(e);
        };
        this.saveMenuItem = (menuItem) => {
            this.menuItem = menuItem;
        };
        this.renderItem = ({ siderCollapsed }) => {
            const { level, children, rootPrefixCls } = this.props;
            const _a = this.props, { title } = _a, rest = __rest(_a, ["title"]);
            return (<MenuContext.Consumer>
        {({ inlineCollapsed }) => {
                let titleNode = title || (level === 1 ? children : '');
                if (!siderCollapsed && !inlineCollapsed) {
                    titleNode = null;
                }
                return (<Tooltip title={titleNode} placement="right" overlayClassName={`${rootPrefixCls}-inline-collapsed-tooltip`}>
              <Item {...rest} title={title} ref={this.saveMenuItem}/>
            </Tooltip>);
            }}
      </MenuContext.Consumer>);
        };
    }
    render() {
        return <SiderContext.Consumer>{this.renderItem}</SiderContext.Consumer>;
    }
}
MenuItem.isMenuItem = true;
