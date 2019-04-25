import * as React from 'react';
import { ConfigConsumer } from '../config-provider';
import Icon from '../icon';
import classnames from 'classnames';
import Divider from '../divider';
import Breadcrumb from '../breadcrumb';
import Wave from '../_util/wave';
const renderBack = (prefixCls, backIcon, onBack) => {
    if (!backIcon || !onBack) {
        return null;
    }
    return (<div className={`${prefixCls}-back-icon`} onClick={e => {
        if (onBack) {
            onBack(e);
        }
    }}>
      <Wave>{backIcon}</Wave>
      <Divider type="vertical"/>
    </div>);
};
const renderBreadcrumb = (breadcrumb) => {
    return <Breadcrumb {...breadcrumb}/>;
};
const renderHeader = (prefixCls, props) => {
    const { breadcrumb, backIcon, onBack } = props;
    if (breadcrumb && breadcrumb.routes && breadcrumb.routes.length >= 2) {
        return renderBreadcrumb(breadcrumb);
    }
    return renderBack(prefixCls, backIcon, onBack);
};
const renderTitle = (prefixCls, props) => {
    const { title, subTitle, tags, extra } = props;
    const titlePrefixCls = `${prefixCls}-title-view`;
    return (<div className={`${prefixCls}-title-view`}>
      <span className={`${titlePrefixCls}-title`}>{title}</span>
      {subTitle && <span className={`${titlePrefixCls}-sub-title`}>{subTitle}</span>}
      {tags && <span className={`${titlePrefixCls}-tags`}>{tags}</span>}
      {extra && <span className={`${titlePrefixCls}-extra`}>{extra}</span>}
    </div>);
};
const renderFooter = (prefixCls, footer) => {
    if (footer) {
        return <div className={`${prefixCls}-footer`}>{footer}</div>;
    }
    return null;
};
const PageHeader = props => (<ConfigConsumer>
    {({ getPrefixCls }) => {
    const { prefixCls: customizePrefixCls, style, footer, children, className: customizeClassName, } = props;
    const prefixCls = getPrefixCls('page-header', customizePrefixCls);
    const className = classnames(prefixCls, {
        [`${prefixCls}-has-footer`]: footer,
    }, customizeClassName);
    return (<div className={className} style={style}>
          {renderHeader(prefixCls, props)}
          {renderTitle(prefixCls, props)}
          {children && <div className={`${prefixCls}-content-view`}>{children}</div>}
          {renderFooter(prefixCls, footer)}
        </div>);
}}
  </ConfigConsumer>);
PageHeader.defaultProps = {
    backIcon: <Icon type="arrow-left"/>,
};
export default PageHeader;
