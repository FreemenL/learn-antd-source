// 测试数组是否包含某项
const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'jest'
  ];
  
test('the shopping list has beer on it', () => {
  expect(shoppingList).toContain('jest');
  expect(new Set(shoppingList)).toContain('jest');
});