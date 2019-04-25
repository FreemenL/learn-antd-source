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
import debounce from 'lodash/debounce';
import { conductExpandParent, convertTreeToEntities } from 'rc-tree/lib/util';
import { ConfigConsumer } from '../config-provider';
import { polyfill } from 'react-lifecycles-compat';
import Tree from './Tree';
import { calcRangeKeys, getFullKeyList, convertDirectoryKeysToNodes } from './util';
import Icon from '../icon';
function getIcon(props) {
    const { isLeaf, expanded } = props;
    if (isLeaf) {
        return <Icon type="file"/>;
    }
    return <Icon type={expanded ? 'folder-open' : 'folder'}/>;
}
class DirectoryTree extends React.Component {
    constructor(props) {
        super(props);
        this.onExpand = (expandedKeys, info) => {
            const { onExpand } = this.props;
            this.setUncontrolledState({ expandedKeys });
            // Call origin function
            if (onExpand) {
                return onExpand(expandedKeys, info);
            }
            return undefined;
        };
        this.onClick = (event, node) => {
            const { onClick, expandAction } = this.props;
            // Expand the tree
            if (expandAction === 'click') {
                this.onDebounceExpand(event, node);
            }
            if (onClick) {
                onClick(event, node);
            }
        };
        this.onDoubleClick = (event, node) => {
            const { onDoubleClick, expandAction } = this.props;
            // Expand the tree
            if (expandAction === 'doubleClick') {
                this.onDebounceExpand(event, node);
            }
            if (onDoubleClick) {
                onDoubleClick(event, node);
            }
        };
        this.onSelect = (keys, event) => {
            const { onSelect, multiple, children } = this.props;
            const { expandedKeys = [] } = this.state;
            const { node, nativeEvent } = event;
            const { eventKey = '' } = node.props;
            const newState = {};
            // We need wrap this event since some value is not same
            const newEvent = Object.assign({}, event, { selected: true });
            // Windows / Mac single pick
            const ctrlPick = nativeEvent.ctrlKey || nativeEvent.metaKey;
            const shiftPick = nativeEvent.shiftKey;
            // Generate new selected keys
            let newSelectedKeys;
            if (multiple && ctrlPick) {
                // Control click
                newSelectedKeys = keys;
                this.lastSelectedKey = eventKey;
                this.cachedSelectedKeys = newSelectedKeys;
                newEvent.selectedNodes = convertDirectoryKeysToNodes(children, newSelectedKeys);
            }
            else if (multiple && shiftPick) {
                // Shift click
                newSelectedKeys = Array.from(new Set([
                    ...(this.cachedSelectedKeys || []),
                    ...calcRangeKeys(children, expandedKeys, eventKey, this.lastSelectedKey),
                ]));
                newEvent.selectedNodes = convertDirectoryKeysToNodes(children, newSelectedKeys);
            }
            else {
                // Single click
                newSelectedKeys = [eventKey];
                this.lastSelectedKey = eventKey;
                this.cachedSelectedKeys = newSelectedKeys;
                newEvent.selectedNodes = [event.node];
            }
            newState.selectedKeys = newSelectedKeys;
            if (onSelect) {
                onSelect(newSelectedKeys, newEvent);
            }
            this.setUncontrolledState(newState);
        };
        this.setTreeRef = (node) => {
            this.tree = node;
        };
        this.expandFolderNode = (event, node) => {
            const { isLeaf } = node.props;
            if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
                return;
            }
            // Get internal rc-tree
            const internalTree = this.tree.tree;
            // Call internal rc-tree expand function
            // https://github.com/ant-design/ant-design/issues/12567
            internalTree.onNodeExpand(event, node);
        };
        this.setUncontrolledState = (state) => {
            const newState = omit(state, Object.keys(this.props));
            if (Object.keys(newState).length) {
                this.setState(newState);
            }
        };
        this.renderDirectoryTree = ({ getPrefixCls }) => {
            const _a = this.props, { prefixCls: customizePrefixCls, className } = _a, props = __rest(_a, ["prefixCls", "className"]);
            const { expandedKeys, selectedKeys } = this.state;
            const prefixCls = getPrefixCls('tree', customizePrefixCls);
            const connectClassName = classNames(`${prefixCls}-directory`, className);
            return (<Tree icon={getIcon} ref={this.setTreeRef} {...props} prefixCls={prefixCls} className={connectClassName} expandedKeys={expandedKeys} selectedKeys={selectedKeys} onSelect={this.onSelect} onClick={this.onClick} onDoubleClick={this.onDoubleClick} onExpand={this.onExpand}/>);
        };
        const { defaultExpandAll, defaultExpandParent, expandedKeys, defaultExpandedKeys, children, } = props;
        const { keyEntities } = convertTreeToEntities(children);
        // Selected keys
        this.state = {
            selectedKeys: props.selectedKeys || props.defaultSelectedKeys || [],
        };
        // Expanded keys
        if (defaultExpandAll) {
            this.state.expandedKeys = getFullKeyList(props.children);
        }
        else if (defaultExpandParent) {
            this.state.expandedKeys = conductExpandParent(expandedKeys || defaultExpandedKeys, keyEntities);
        }
        else {
            this.state.expandedKeys = expandedKeys || defaultExpandedKeys;
        }
        this.onDebounceExpand = debounce(this.expandFolderNode, 200, {
            leading: true,
        });
    }
    static getDerivedStateFromProps(nextProps) {
        const newState = {};
        if ('expandedKeys' in nextProps) {
            newState.expandedKeys = nextProps.expandedKeys;
        }
        if ('selectedKeys' in nextProps) {
            newState.selectedKeys = nextProps.selectedKeys;
        }
        return newState;
    }
    render() {
        return <ConfigConsumer>{this.renderDirectoryTree}</ConfigConsumer>;
    }
}
DirectoryTree.defaultProps = {
    showIcon: true,
    expandAction: 'click',
};
polyfill(DirectoryTree);
export default DirectoryTree;
