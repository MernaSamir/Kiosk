
import  sum from 'sum'
test('two plus two is four', () => {
    expect(2 + 2).toBe(4); // tobe is the matcher
  });
  test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });
 