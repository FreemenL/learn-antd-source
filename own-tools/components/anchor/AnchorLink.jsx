import * as React from 'react';
import * as PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import { ConfigConsumer } from '../config-provider';
class AnchorLink extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClick = (e) => {
            const { scrollTo, onClick } = this.context.antAnchor;
            const { href, title } = this.props;
            if (onClick) {
                onClick(e, { title, href });
            }
            scrollTo(href);
        };
        this.renderAnchorLink = ({ getPrefixCls }) => {
            const { prefixCls: customizePrefixCls, href, title, children, className } = this.props;
            const prefixCls = getPrefixCls('anchor', customizePrefixCls);
            const active = this.context.antAnchor.activeLink === href;
            const wrapperClassName = classNames(className, `${prefixCls}-link`, {
                [`${prefixCls}-link-active`]: active,
            });
            const titleClassName = classNames(`${prefixCls}-link-title`, {
                [`${prefixCls}-link-title-active`]: active,
            });
            return (<div className={wrapperClassName}>
        <a className={titleClassName} href={href} title={typeof title === 'string' ? title : ''} onClick={this.handleClick}>
          {title}
        </a>
        {children}
      </div>);
        };
    }
    componentDidMount() {
        this.context.antAnchor.registerLink(this.props.href);
    }
    componentDidUpdate({ href: prevHref }) {
        const { href } = this.props;
        if (prevHref !== href) {
            this.context.antAnchor.unregisterLink(prevHref);
            this.context.antAnchor.registerLink(href);
        }
    }
    componentWillUnmount() {
        this.context.antAnchor.unregisterLink(this.props.href);
    }
    render() {
        return <ConfigConsumer>{this.renderAnchorLink}</ConfigConsumer>;
    }
}
AnchorLink.defaultProps = {
    href: '#',
};
AnchorLink.contextTypes = {
    antAnchor: PropTypes.object,
};
polyfill(AnchorLink);
export default AnchorLink;
