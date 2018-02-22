import {interpolateDeep} from '../schema';

describe('Schema test', () => {
  it('interpolate', async () => {
    const mapFnMock = jest.fn((...args) => args[0]);
    const o = {
      $source: 'value1',
      key1: {
        $source: 'value2',
      },
      key2: {
        key3: {
          $source: 'value3',
        },
      },
    };
    const expected = {
      key1: {},
      key2: {
        key3: {},
      },
    };
    expect(await interpolateDeep(o, {mapFn: mapFnMock})).toEqual(expected);
    expect(mapFnMock.mock.calls.length).toBe(3);
    expect(mapFnMock.mock.calls).toContainEqual([{}, '$source', 'value3']);
    expect(mapFnMock.mock.calls).toContainEqual([{}, '$source', 'value2']);
    expect(mapFnMock.mock.calls).toContainEqual([{key1: {}, key2:{key3: {}}}, '$source', 'value1']);
  });
});
