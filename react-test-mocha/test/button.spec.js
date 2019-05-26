// Chai是 node 和浏览器的BDD /TDD断言库，可以与任何javascript测试框架愉快地配对
import chai from 'chai';
import sinon  from "sinon";
// 使用Sinon.JS模拟框架的断言扩展Chai
import sinonChai  from "sinon-chai";
import { JSDOM } from  'jsdom';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import Button from '../button';
import { 
    renderIntoDocument ,
    findRenderedDOMComponentWithTag ,
    Simulate,
} from 'react-dom/test-utils';

chai.should();

chai.use(sinonChai);

const expect  = chai.expect; 

const { window } = new JSDOM(`...`);
// or even
const { document } = (new JSDOM(`...`)).window;

global.document = document;

global.window = window;

function hello(name, cb) {
    cb("hello " + name);
}

//描述按钮的行为 
describe('Test for Button', () => {
    // 这里我们希望元素类型和文本是正确的
    it('renders with text', () => {
        //定义文本变量，以判断预测代码是否有效:
        const text = 'text';
        // 浅渲染
        const renderer = new ShallowRenderer();
        renderer.render(<Button text={text} />);
        const button = renderer.getRenderOutput();
        expect(button.type).to.equal('button')
        expect(button.props.children).to.equal(text)
    })
    it('fires the onClick callback', () => {
        
        const onClick = sinon.spy();

        hello("foo", onClick);
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
        //
        expect(onClick).to.have.been.calledWith("hello foo");
    })
})

// 浅渲染与完整 DOM 渲染的区别 
// 浅渲染只渲染一级组件对子组件不作处理  
