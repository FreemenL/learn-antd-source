/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
const inlineStyle = {
    border: 0,
    background: 'transparent',
    padding: 0,
    lineHeight: 'inherit',
};
class TransButton extends React.Component {
    constructor() {
        super(...arguments);
        this.onKeyDown = event => {
            const { keyCode } = event;
            if (keyCode === KeyCode.ENTER) {
                event.preventDefault();
            }
        };
        this.onKeyUp = event => {
            const { keyCode } = event;
            const { onClick } = this.props;
            if (keyCode === KeyCode.ENTER && onClick) {
                onClick();
            }
        };
        this.setRef = (btn) => {
            this.button = btn;
        };
    }
    focus() {
        if (this.button) {
            this.button.focus();
        }
    }
    blur() {
        if (this.button) {
            this.button.blur();
        }
    }
    render() {
        const { style } = this.props;
        return (<button ref={this.setRef} {...this.props} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} style={Object.assign({}, inlineStyle, style)}/>);
    }
}
export default TransButton;
