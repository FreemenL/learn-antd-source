import * as React from 'react';
import * as PropTypes from 'prop-types';
import RcSwitch from 'rc-switch';
import classNames from 'classnames';
import omit from 'omit.js';
import Wave from '../_util/wave';
import Icon from '../icon';
import { ConfigConsumer } from '../config-provider';
export default class Switch extends React.Component {
    constructor() {
        super(...arguments);
        this.saveSwitch = (node) => {
            this.rcSwitch = node;
        };
        this.renderSwitch = ({ getPrefixCls }) => {
            const { prefixCls: customizePrefixCls, size, loading, className = '', disabled } = this.props;
            const prefixCls = getPrefixCls('switch', customizePrefixCls);
            const classes = classNames(className, {
                [`${prefixCls}-small`]: size === 'small',
                [`${prefixCls}-loading`]: loading,
            });
            const loadingIcon = loading ? (<Icon type="loading" className={`${prefixCls}-loading-icon`}/>) : null;
            return (<Wave insertExtraNode>
        <RcSwitch {...omit(this.props, ['loading'])} prefixCls={prefixCls} className={classes} disabled={disabled || loading} ref={this.saveSwitch} loadingIcon={loadingIcon}/>
      </Wave>);
        };
    }
    focus() {
        this.rcSwitch.focus();
    }
    blur() {
        this.rcSwitch.blur();
    }
    render() {
        return <ConfigConsumer>{this.renderSwitch}</ConfigConsumer>;
    }
}
Switch.propTypes = {
    prefixCls: PropTypes.string,
    // HACK: https://github.com/ant-design/ant-design/issues/5368
    // size=default and size=large are the same
    size: PropTypes.oneOf(['small', 'default', 'large']),
    className: PropTypes.string,
};
