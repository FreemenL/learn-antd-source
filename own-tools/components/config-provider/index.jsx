import * as React from 'react';
import createReactContext from 'create-react-context';
import defaultRenderEmpty from './renderEmpty';
export const configConsumerProps = [
    'getPopupContainer',
    'rootPrefixCls',
    'getPrefixCls',
    'renderEmpty',
    'csp',
    'autoInsertSpaceInButton',
];
const ConfigContext = createReactContext({
    // We provide a default function for Context without provider
    getPrefixCls: (suffixCls, customizePrefixCls) => {
        if (customizePrefixCls)
            return customizePrefixCls;
        return `ant-${suffixCls}`;
    },
    renderEmpty: defaultRenderEmpty,
});
export const ConfigConsumer = ConfigContext.Consumer;
class ConfigProvider extends React.Component {
    constructor() {
        super(...arguments);
        this.getPrefixCls = (suffixCls, customizePrefixCls) => {
            const { prefixCls = 'ant' } = this.props;
            if (customizePrefixCls)
                return customizePrefixCls;
            return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
        };
        this.renderProvider = (context) => {
            const { children, getPopupContainer, renderEmpty, csp, autoInsertSpaceInButton } = this.props;
            const config = Object.assign({}, context, { getPrefixCls: this.getPrefixCls, csp,
                autoInsertSpaceInButton });
            if (getPopupContainer) {
                config.getPopupContainer = getPopupContainer;
            }
            if (renderEmpty) {
                config.renderEmpty = renderEmpty;
            }
            return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
        };
    }
    render() {
        return <ConfigConsumer>{this.renderProvider}</ConfigConsumer>;
    }
}
export function withConfigConsumer(config) {
    return function (Component) {
        // Wrap with ConfigConsumer. Since we need compatible with react 15, be care when using ref methods
        const SFC = ((props) => (<ConfigConsumer>
        {(configProps) => {
            const { prefixCls: basicPrefixCls } = config;
            const { getPrefixCls } = configProps;
            const { prefixCls: customizePrefixCls } = props;
            const prefixCls = getPrefixCls(basicPrefixCls, customizePrefixCls);
            return <Component {...configProps} {...props} prefixCls={prefixCls}/>;
        }}
      </ConfigConsumer>));
        const cons = Component.constructor;
        const name = (cons && cons.displayName) || Component.name || 'Component';
        SFC.displayName = `withConfigConsumer(${name})`;
        return SFC;
    };
}
export default ConfigProvider;
