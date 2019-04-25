import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { polyfill } from 'react-lifecycles-compat';
import Icon from '../icon';
import TextArea from '../input/TextArea';
class Editable extends React.Component {
    constructor() {
        super(...arguments);
        this.inComposition = false;
        this.state = {
            current: '',
        };
        this.onChange = ({ target: { value } }) => {
            this.setState({ current: value.replace(/[\r\n]/g, '') });
        };
        this.onCompositionStart = () => {
            this.inComposition = true;
        };
        this.onCompositionEnd = () => {
            this.inComposition = false;
        };
        this.onKeyDown = ({ keyCode }) => {
            // We don't record keyCode when IME is using
            if (this.inComposition)
                return;
            this.lastKeyCode = keyCode;
        };
        this.onKeyUp = ({ keyCode, ctrlKey, altKey, metaKey, shiftKey, }) => {
            const { onCancel } = this.props;
            // Check if it's a real key
            if (this.lastKeyCode === keyCode &&
                !this.inComposition &&
                !ctrlKey &&
                !altKey &&
                !metaKey &&
                !shiftKey) {
                if (keyCode === KeyCode.ENTER) {
                    this.confirmChange();
                }
                else if (keyCode === KeyCode.ESC) {
                    onCancel();
                }
            }
        };
        this.onBlur = () => {
            this.confirmChange();
        };
        this.confirmChange = () => {
            const { current } = this.state;
            const { onSave } = this.props;
            onSave(current.trim());
        };
        this.setTextarea = (textarea) => {
            this.textarea = textarea;
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { prevValue } = prevState;
        const { value } = nextProps;
        const newState = {
            prevValue: value,
        };
        if (prevValue !== value) {
            newState.current = value;
        }
        return newState;
    }
    componentDidMount() {
        if (this.textarea) {
            this.textarea.focus();
        }
    }
    render() {
        const { current } = this.state;
        const { prefixCls, ['aria-label']: ariaLabel } = this.props;
        return (<div className={`${prefixCls} ${prefixCls}-edit-content`}>
        <TextArea ref={this.setTextarea} value={current} onChange={this.onChange} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} onCompositionStart={this.onCompositionStart} onCompositionEnd={this.onCompositionEnd} onBlur={this.onBlur} aria-label={ariaLabel} autosize/>
        <Icon type="enter" className={`${prefixCls}-edit-content-confirm`}/>
      </div>);
    }
}
polyfill(Editable);
export default Editable;
