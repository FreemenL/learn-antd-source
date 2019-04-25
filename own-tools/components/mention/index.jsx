import * as React from 'react';
import RcMention, { Nav, toString, toEditorState, getMentions } from 'rc-editor-mention';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import Icon from '../icon';
import { ConfigConsumer } from '../config-provider';
class Mention extends React.Component {
    constructor(props) {
        super(props);
        this.onSearchChange = (value, prefix) => {
            if (this.props.onSearchChange) {
                return this.props.onSearchChange(value, prefix);
            }
            return this.defaultSearchChange(value);
        };
        this.onChange = (editorState) => {
            if (this.props.onChange) {
                this.props.onChange(editorState);
            }
        };
        this.onFocus = (ev) => {
            this.setState({
                focus: true,
            });
            if (this.props.onFocus) {
                this.props.onFocus(ev);
            }
        };
        this.onBlur = (ev) => {
            this.setState({
                focus: false,
            });
            if (this.props.onBlur) {
                this.props.onBlur(ev);
            }
        };
        this.focus = () => {
            this.mentionEle._editor.focusEditor();
        };
        this.mentionRef = (ele) => {
            this.mentionEle = ele;
        };
        this.renderMention = ({ getPrefixCls }) => {
            const { prefixCls: customizePrefixCls, className = '', loading, placement, suggestions, } = this.props;
            const { filteredSuggestions, focus } = this.state;
            const prefixCls = getPrefixCls('mention', customizePrefixCls);
            const cls = classNames(className, {
                [`${prefixCls}-active`]: focus,
                [`${prefixCls}-placement-top`]: placement === 'top',
            });
            const notFoundContent = loading ? <Icon type="loading"/> : this.props.notFoundContent;
            return (<RcMention {...this.props} prefixCls={prefixCls} className={cls} ref={this.mentionRef} onSearchChange={this.onSearchChange} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} suggestions={suggestions || filteredSuggestions} notFoundContent={notFoundContent}/>);
        };
        this.state = {
            filteredSuggestions: props.defaultSuggestions,
            focus: false,
        };
    }
    defaultSearchChange(value) {
        const searchValue = value.toLowerCase();
        const filteredSuggestions = (this.props.defaultSuggestions || []).filter(suggestion => {
            if (suggestion.type && suggestion.type === Nav) {
                return suggestion.props.value
                    ? suggestion.props.value.toLowerCase().indexOf(searchValue) !== -1
                    : true;
            }
            return suggestion.toLowerCase().indexOf(searchValue) !== -1;
        });
        this.setState({
            filteredSuggestions,
        });
    }
    render() {
        return <ConfigConsumer>{this.renderMention}</ConfigConsumer>;
    }
}
Mention.getMentions = getMentions;
Mention.defaultProps = {
    notFoundContent: 'No matches found',
    loading: false,
    multiLines: false,
    placement: 'bottom',
};
Mention.Nav = Nav;
Mention.toString = toString;
Mention.toContentState = toEditorState;
polyfill(Mention);
export default Mention;
