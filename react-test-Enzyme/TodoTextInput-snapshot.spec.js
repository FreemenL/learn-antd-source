import React from 'react'
import renderer from 'react-test-renderer';
import TodoTextInput from './TodoTextInput';

test('snapshots are awesome', () => {

    const component = renderer.create(
        <TodoTextInput onSave={() => {}} editing />
    )
    const tree = component.toJSON();
    // 快照测试  会生成 __snapshots__
    expect(tree).toMatchSnapshot()

})