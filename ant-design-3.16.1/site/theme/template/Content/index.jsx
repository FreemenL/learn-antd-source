// import collect from 'bisheng/collect';
import MainContent from './MainContent';
import * as utils from '../utils';

function isChangelog(pathname) {
  return pathname.indexOf('changelog') >= 0;
}


const collect = ( collector ) => ( Component )=> {
    Component.collector = collector;
    return Component;
};
// 通过bisheng里面的 routes.nunjucks.jsx 文件中的getRoutes函数中的 templateWrapper 方法调用 
// 目的是为组件nextProps 属性赋值
export default collect(async nextProps => {
  const { pathname } = nextProps.location;
  const pageDataPath = pathname.replace('-cn', '').split('/');
  const pageData = isChangelog(pathname)
    ? nextProps.data.changelog.CHANGELOG
    : nextProps.utils.get(nextProps.data, pageDataPath);
  if (!pageData) {
    throw 404; // eslint-disable-line no-throw-literal
  }
  
  const locale = utils.isZhCN(pathname) ? 'zh-CN' : 'en-US';
  const pageDataPromise =
    typeof pageData === 'function'
      ? pageData()
      : (pageData[locale] || pageData.index[locale] || pageData.index)();
  // nextProps.data 是通过bisheng0-data-loader 对components 下的markdown 文件等数据进行转换及整合
  const demosFetcher = nextProps.utils.get(nextProps.data, [...pageDataPath, 'demo']);
  if (demosFetcher) {
    const [localizedPageData, demos] = await Promise.all([pageDataPromise, demosFetcher()]);
    console.log(demos);
    return { localizedPageData, demos };
  }
  return { localizedPageData: await pageDataPromise };
})(MainContent);
