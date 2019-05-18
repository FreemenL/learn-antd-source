// 不等测试
test('adding positive numbers is not zero', () => {
    for (let a = 1; a < 10; a++) {
      for (let b = 1; b < 10; b++) {
        expect(a + b).not.toBe(0);
      }
    }
});
//测试
test('null', () => {
    const n = null;
    // 只匹配 null
    expect(n).toBeNull();
    // 只匹配定义的
    expect(n).toBeDefined();
    //toBeUndefined 只匹配 undefined
    expect(n).not.toBeUndefined();
    //toBeTruthy 只匹配if语句为真
    expect(n).not.toBeTruthy();
    //toBeFalsy 只匹配if语句为假
    expect(n).toBeFalsy();
});

test('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
});