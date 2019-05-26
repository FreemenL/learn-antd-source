import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow';

import { 
    renderIntoDocument ,
    findRenderedDOMComponentWithTag ,
    Simulate,
} from 'react-dom/test-utils';

import Button from './button';

test('works', () => {
    expect(true).toBe(true)
})

// 浅渲染测试  在测试环境中渲染组件
// 浅渲染允许你按一级深度渲染组件，然后根据它返回的渲染结果进行一些预测 
test('renders with text', () => {
    const text = 'text';
    const renderer = new ShallowRenderer();
    renderer.render(<Button text={text} />);
    const result = renderer.getRenderOutput();
    expect(result.props.children).toBe(text)
})

test("fires the onClick callBack",()=>{
    const onClick = jest.fn()
    // 将React元素渲染到文档中的分离DOM节点中  Button
    const tree = renderIntoDocument(
        <Button onClick={ onClick } />
    )
    // 这个函数会根据传入的标签名在渲染树中查找组件  HTMLButtonElement 
    const button = findRenderedDOMComponentWithTag(
        tree,
       'button'
    );
    // 使用可选eventData事件数据模拟DOM节点上的事件调度
    Simulate.click(button);
    // 这里简单地表明我们希望 mock 函数被调用
    expect(onClick).toBeCalled()
})