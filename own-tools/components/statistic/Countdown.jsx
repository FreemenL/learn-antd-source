import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import * as moment from 'moment';
import interopDefault from '../_util/interopDefault';
import Statistic from './Statistic';
import { formatCountdown } from './utils';
const REFRESH_INTERVAL = 1000 / 30;
function getTime(value) {
    return interopDefault(moment)(value).valueOf();
}
class Countdown extends React.Component {
    constructor() {
        super(...arguments);
        this.syncTimer = () => {
            const { value } = this.props;
            const timestamp = getTime(value);
            if (timestamp >= Date.now()) {
                this.startTimer();
            }
            else {
                this.stopTimer();
            }
        };
        this.startTimer = () => {
            if (this.countdownId)
                return;
            this.countdownId = window.setInterval(() => {
                this.forceUpdate();
            }, REFRESH_INTERVAL);
        };
        this.stopTimer = () => {
            const { onFinish, value } = this.props;
            if (this.countdownId) {
                clearInterval(this.countdownId);
                this.countdownId = undefined;
                const timestamp = getTime(value);
                if (onFinish && timestamp < Date.now()) {
                    onFinish();
                }
            }
        };
        this.formatCountdown = (value, config) => {
            const { format } = this.props;
            return formatCountdown(value, Object.assign({}, config, { format }));
        };
        // Countdown do not need display the timestamp
        this.valueRender = (node) => React.cloneElement(node, {
            title: undefined,
        });
    }
    componentDidMount() {
        this.syncTimer();
    }
    componentDidUpdate() {
        this.syncTimer();
    }
    componentWillUnmount() {
        this.stopTimer();
    }
    render() {
        return (<Statistic valueRender={this.valueRender} {...this.props} formatter={this.formatCountdown}/>);
    }
}
Countdown.defaultProps = {
    format: 'HH:mm:ss',
};
polyfill(Countdown);
export default Countdown;
