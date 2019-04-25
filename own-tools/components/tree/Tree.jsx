import * as React from 'react';
import RcTree, { TreeNode } from 'rc-tree';
import DirectoryTree from './DirectoryTree';
import classNames from 'classnames';
import Icon from '../icon';
import { ConfigConsumer } from '../config-provider';
import animation from '../_util/openAnimation';
export default class Tree extends React.Component {
    constructor() {
        super(...arguments);
        this.renderSwitcherIcon = (prefixCls, switcherIcon, { isLeaf, expanded, loading }) => {
            const { showLine } = this.props;
            if (loading) {
                return <Icon type="loading" className={`${prefixCls}-switcher-loading-icon`}/>;
            }
            if (showLine) {
                if (isLeaf) {
                    return <Icon type="file" className={`${prefixCls}-switcher-line-icon`}/>;
                }
                return (<Icon type={expanded ? 'minus-square' : 'plus-square'} className={`${prefixCls}-switcher-line-icon`} theme="outlined"/>);
            }
            else {
                const switcherCls = `${prefixCls}-switcher-icon`;
                if (isLeaf) {
                    return null;
                }
                else if (switcherIcon) {
                    const switcherOriginCls = switcherIcon.props.className || '';
                    return React.cloneElement(switcherIcon, {
                        className: classNames(switcherOriginCls, switcherCls),
                    });
                }
                else {
                    return <Icon type="caret-down" className={switcherCls} theme="filled"/>;
                }
            }
        };
        this.setTreeRef = (node) => {
            this.tree = node;
        };
        this.renderTree = ({ getPrefixCls }) => {
            const props = this.props;
            const { prefixCls: customizePrefixCls, className, showIcon, switcherIcon, blockNode } = props;
            const checkable = props.checkable;
            const prefixCls = getPrefixCls('tree', customizePrefixCls);
            return (<RcTree ref={this.setTreeRef} {...props} prefixCls={prefixCls} className={classNames(className, {
                [`${prefixCls}-icon-hide`]: !showIcon,
                [`${prefixCls}-block-node`]: blockNode,
            })} checkable={checkable ? <span className={`${prefixCls}-checkbox-inner`}/> : checkable} switcherIcon={(nodeProps) => this.renderSwitcherIcon(prefixCls, switcherIcon, nodeProps)}>
        {this.props.children}
      </RcTree>);
        };
    }
    render() {
        return <ConfigConsumer>{this.renderTree}</ConfigConsumer>;
    }
}
Tree.TreeNode = TreeNode;
Tree.DirectoryTree = DirectoryTree;
Tree.defaultProps = {
    checkable: false,
    showIcon: false,
    openAnimation: Object.assign({}, animation, { appear: null }),
    blockNode: false,
};
