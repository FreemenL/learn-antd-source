describe('test testObject', () => {
    const n = null;
    // 只匹配 null

    beforeAll(() => {
        
    })

    test('is foo', () => {
        expect(n).toBeNull();
    })

    test('is not bar', () => {
        expect(n).toBeNull();
    })

    afterAll(() => {
        // require('child_process').exec("npm -v");
    })
})