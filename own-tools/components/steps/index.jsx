import * as React from 'react';
import * as PropTypes from 'prop-types';
import RcSteps from 'rc-steps';
import Icon from '../icon';
import { ConfigConsumer } from '../config-provider';
export default class Steps extends React.Component {
    constructor() {
        super(...arguments);
        this.renderSteps = ({ getPrefixCls }) => {
            const prefixCls = getPrefixCls('steps', this.props.prefixCls);
            const iconPrefix = getPrefixCls('', this.props.iconPrefix);
            const icons = {
                finish: <Icon type="check" className={`${prefixCls}-finish-icon`}/>,
                error: <Icon type="close" className={`${prefixCls}-error-icon`}/>,
            };
            return <RcSteps icons={icons} {...this.props} prefixCls={prefixCls} iconPrefix={iconPrefix}/>;
        };
    }
    render() {
        return <ConfigConsumer>{this.renderSteps}</ConfigConsumer>;
    }
}
Steps.Step = RcSteps.Step;
Steps.defaultProps = {
    current: 0,
};
Steps.propTypes = {
    prefixCls: PropTypes.string,
    iconPrefix: PropTypes.string,
    current: PropTypes.number,
};
