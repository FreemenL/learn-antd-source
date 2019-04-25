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
import omit from 'omit.js';
import Grid from './Grid';
import Meta from './Meta';
import Tabs from '../tabs';
import Row from '../row';
import Col from '../col';
import { ConfigConsumer } from '../config-provider';
import warning from '../_util/warning';
export default class Card extends React.Component {
    constructor() {
        super(...arguments);
        this.onTabChange = (key) => {
            if (this.props.onTabChange) {
                this.props.onTabChange(key);
            }
        };
        this.renderCard = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls: customizePrefixCls, className, extra, headStyle = {}, bodyStyle = {}, noHovering, hoverable, title, loading, bordered = true, size = 'default', type, cover, actions, tabList, children, activeTabKey, defaultActiveTabKey } = _a, others = __rest(_a, ["prefixCls", "className", "extra", "headStyle", "bodyStyle", "noHovering", "hoverable", "title", "loading", "bordered", "size", "type", "cover", "actions", "tabList", "children", "activeTabKey", "defaultActiveTabKey"]);
            const prefixCls = getPrefixCls('card', customizePrefixCls);
            const classString = classNames(prefixCls, className, {
                [`${prefixCls}-loading`]: loading,
                [`${prefixCls}-bordered`]: bordered,
                [`${prefixCls}-hoverable`]: this.getCompatibleHoverable(),
                [`${prefixCls}-contain-grid`]: this.isContainGrid(),
                [`${prefixCls}-contain-tabs`]: tabList && tabList.length,
                [`${prefixCls}-${size}`]: size !== 'default',
                [`${prefixCls}-type-${type}`]: !!type,
            });
            const loadingBlockStyle = bodyStyle.padding === 0 || bodyStyle.padding === '0px' ? { padding: 24 } : undefined;
            const loadingBlock = (<div className={`${prefixCls}-loading-content`} style={loadingBlockStyle}>
        <Row gutter={8}>
          <Col span={22}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
          <Col span={15}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
          <Col span={18}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={13}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
          <Col span={9}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
          <Col span={3}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
          <Col span={16}>
            <div className={`${prefixCls}-loading-block`}/>
          </Col>
        </Row>
      </div>);
            const hasActiveTabKey = activeTabKey !== undefined;
            const extraProps = {
                [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
                    ? activeTabKey
                    : defaultActiveTabKey,
            };
            let head;
            const tabs = tabList && tabList.length ? (<Tabs {...extraProps} className={`${prefixCls}-head-tabs`} size="large" onChange={this.onTabChange}>
          {tabList.map(item => (<Tabs.TabPane tab={item.tab} disabled={item.disabled} key={item.key}/>))}
        </Tabs>) : null;
            if (title || extra || tabs) {
                head = (<div className={`${prefixCls}-head`} style={headStyle}>
          <div className={`${prefixCls}-head-wrapper`}>
            {title && <div className={`${prefixCls}-head-title`}>{title}</div>}
            {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
          </div>
          {tabs}
        </div>);
            }
            const coverDom = cover ? <div className={`${prefixCls}-cover`}>{cover}</div> : null;
            const body = (<div className={`${prefixCls}-body`} style={bodyStyle}>
        {loading ? loadingBlock : children}
      </div>);
            const actionDom = actions && actions.length ? (<ul className={`${prefixCls}-actions`}>{this.getAction(actions)}</ul>) : null;
            const divProps = omit(others, ['onTabChange']);
            return (<div {...divProps} className={classString}>
        {head}
        {coverDom}
        {body}
        {actionDom}
      </div>);
        };
    }
    componentDidMount() {
        if ('noHovering' in this.props) {
            warning(!this.props.noHovering, 'Card', '`noHovering` is deprecated, you can remove it safely or use `hoverable` instead.');
            warning(!!this.props.noHovering, 'Card', '`noHovering={false}` is deprecated, use `hoverable` instead.');
        }
    }
    isContainGrid() {
        let containGrid;
        React.Children.forEach(this.props.children, (element) => {
            if (element && element.type && element.type === Grid) {
                containGrid = true;
            }
        });
        return containGrid;
    }
    getAction(actions) {
        const actionList = actions.map((action, index) => (<li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
        <span>{action}</span>
      </li>));
        return actionList;
    }
    // For 2.x compatible
    getCompatibleHoverable() {
        const { noHovering, hoverable } = this.props;
        if ('noHovering' in this.props) {
            return !noHovering || hoverable;
        }
        return !!hoverable;
    }
    render() {
        return <ConfigConsumer>{this.renderCard}</ConfigConsumer>;
    }
}
Card.Grid = Grid;
Card.Meta = Meta;
