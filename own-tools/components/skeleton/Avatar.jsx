import * as React from 'react';
import classNames from 'classnames';
class SkeletonAvatar extends React.Component {
    render() {
        const { prefixCls, className, style, size, shape } = this.props;
        const sizeCls = classNames({
            [`${prefixCls}-lg`]: size === 'large',
            [`${prefixCls}-sm`]: size === 'small',
        });
        const shapeCls = classNames({
            [`${prefixCls}-circle`]: shape === 'circle',
            [`${prefixCls}-square`]: shape === 'square',
        });
        return <span className={classNames(prefixCls, className, sizeCls, shapeCls)} style={style}/>;
    }
}
SkeletonAvatar.defaultProps = {
    size: 'large',
};
export default SkeletonAvatar;
