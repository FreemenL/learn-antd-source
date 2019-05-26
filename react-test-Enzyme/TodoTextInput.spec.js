import React from 'react'
import {configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TodoTextInput from './TodoTextInput'

configure({ adapter: new Adapter() });

const noop = () => {}

describe("test for input",()=>{
    // value 属性的检测
    test('sets the text prop as value', () => {
        const text = 'text'
        const wrapper = shallow(
        <TodoTextInput text={text} onSave={noop} />
        )
        expect(wrapper.prop('value')).toBe(text)
    })

    //placeholder 检测
    test('uses the placeholder prop', () => {
        const placeholder = 'placeholder'
        const wrapper = shallow(
        <TodoTextInput placeholder={placeholder} onSave={noop} />
        )
        expect(wrapper.prop('placeholder')).toBe(placeholder) 
    })

    // 类名的检测
    test('applies the right class names', () => {
        const wrapper = shallow(
        <TodoTextInput editing newTodo onSave={noop} />
        )
        expect(wrapper.hasClass('edit new-todo')).toBe(true)
    })

    // 按下enter 键 触发onSave 
    test('fires onSave on enter', () => {
        const onSave = jest.fn()
        const value = 'value'
        const wrapper = shallow(<TodoTextInput onSave={onSave} />)
        wrapper.simulate('keydown', { target: { value }, which: 13 })
        expect(onSave).toHaveBeenCalledWith(value)
    })

    //当按下其他按钮时 onSave 函数不被调用
    test('does not fire onSave on key down', () => {
        const onSave = jest.fn()
        const wrapper = shallow(<TodoTextInput onSave={onSave} />)
        wrapper.simulate('keydown', { target: { value: '' } })
        expect(onSave).not.toBeCalled()
    })

    //  newTodo props 为true时 清空输入框
    test('clears the value after save if new', () => {
        const value = 'value'
        const wrapper = shallow(<TodoTextInput newTodo onSave={noop} />)
        wrapper.simulate('keydown', { target: { value }, which: 13 })
        expect(wrapper.prop('value')).toBe('')
    })
    // 检测组件setState 后value 属性的值
    test('updates the text on change', () => {
        const value = 'value'
        const wrapper = shallow(<TodoTextInput onSave={noop} />)
        wrapper.simulate('change', { target: { value } })
        expect(wrapper.prop('value')).toBe(value)
    })
    //检查，当没有新待办事项时，才会触发 blur 事件的回调
    test('fires onSave on blur if not new', () => {
        const onSave = jest.fn()
        const value = 'value'
        const wrapper = shallow(<TodoTextInput onSave={onSave} />)
        wrapper.simulate('blur', { target: { value } })
        expect(onSave).toHaveBeenCalledWith(value)
    })

    test('does not fire onSave on blur if new', () => {
        const onSave = jest.fn()
        const wrapper = shallow(
            <TodoTextInput newTodo onSave={onSave} />
        )
        wrapper.simulate('blur')
        expect(onSave).not.toBeCalled()
    })
})





