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
import classNames from 'classnames';
import { Col } from '../grid';
import { ConfigConsumer } from '../config-provider';
export const Meta = (props) => (<ConfigConsumer>
    {({ getPrefixCls }) => {
    const { prefixCls: customizePrefixCls, className, avatar, title, description } = props, others = __rest(props, ["prefixCls", "className", "avatar", "title", "description"]);
    const prefixCls = getPrefixCls('list', customizePrefixCls);
    const classString = classNames(`${prefixCls}-item-meta`, className);
    const content = (<div className={`${prefixCls}-item-meta-content`}>
          {title && <h4 className={`${prefixCls}-item-meta-title`}>{title}</h4>}
          {description && <div className={`${prefixCls}-item-meta-description`}>{description}</div>}
        </div>);
    return (<div {...others} className={classString}>
          {avatar && <div className={`${prefixCls}-item-meta-avatar`}>{avatar}</div>}
          {(title || description) && content}
        </div>);
}}
  </ConfigConsumer>);
function getGrid(grid, t) {
    return grid[t] && Math.floor(24 / grid[t]);
}
export default class Item extends React.Component {
    constructor() {
        super(...arguments);
        this.renderItem = ({ getPrefixCls }) => {
            const { grid, itemLayout } = this.context;
            const _a = this.props, { prefixCls: customizePrefixCls, children, actions, extra, className } = _a, others = __rest(_a, ["prefixCls", "children", "actions", "extra", "className"]);
            const prefixCls = getPrefixCls('list', customizePrefixCls);
            const actionsContent = actions && actions.length > 0 && (<ul className={`${prefixCls}-item-action`} key="actions">
        {actions.map((action, i) => (<li key={`${prefixCls}-item-action-${i}`}>
            {action}
            {i !== actions.length - 1 && <em className={`${prefixCls}-item-action-split`}/>}
          </li>))}
      </ul>);
            const itemChildren = (<div {...others} className={classNames(`${prefixCls}-item`, className, {
                [`${prefixCls}-item-no-flex`]: !this.isFlexMode(),
            })}>
        {itemLayout === 'vertical' && extra
                ? [
                    <div className={`${prefixCls}-item-main`} key="content">
                {children}
                {actionsContent}
              </div>,
                    <div className={`${prefixCls}-item-extra`} key="extra">
                {extra}
              </div>,
                ]
                : [
                    children,
                    actionsContent,
                    extra ? React.cloneElement(extra, { key: 'extra' }) : null,
                ]}
      </div>);
            return grid ? (<Col span={getGrid(grid, 'column')} xs={getGrid(grid, 'xs')} sm={getGrid(grid, 'sm')} md={getGrid(grid, 'md')} lg={getGrid(grid, 'lg')} xl={getGrid(grid, 'xl')} xxl={getGrid(grid, 'xxl')}>
        {itemChildren}
      </Col>) : (itemChildren);
        };
    }
    isItemContainsTextNode() {
        const { children } = this.props;
        let result;
        React.Children.forEach(children, (element) => {
            if (typeof element === 'string') {
                result = true;
            }
        });
        return result;
    }
    isFlexMode() {
        const { extra } = this.props;
        const { itemLayout } = this.context;
        if (itemLayout === 'vertical') {
            return !!extra;
        }
        return !this.isItemContainsTextNode();
    }
    render() {
        return <ConfigConsumer>{this.renderItem}</ConfigConsumer>;
    }
}
Item.Meta = Meta;
Item.contextTypes = {
    grid: PropTypes.any,
    itemLayout: PropTypes.string,
};
