import React from 'react'
import {configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from './button';

configure({ adapter: new Adapter() });
// 浅渲染测试  在测试环境中渲染组件
// Enzyme 可以在浅渲染元素中模拟事件
test('renders with text', () => {
    const text = 'text';
    const button = shallow(<Button text={text} />);
    expect(button.type()).toBe('button')
    expect(button.text()).toBe(text)
})

test("fires the onClick callBack",()=>{

    const onClick = jest.fn()
    // 将React元素渲染到文档中的分离DOM节点中  Button
    const button = shallow(<Button onClick={onClick} />);
    
    button.simulate('click');

    // 这里简单地表明我们希望 mock 函数被调用
    expect(onClick).toBeCalled();
    
})
