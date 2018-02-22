import {interpolateDeep} from '../schema';

function mapFn(o: any, key: string, value: any) {
  o.removed = {
    [key]: value,
  };
  return o;
}
describe('Schema test', () => {
  it('interpolate', () => {
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
      key1: {
        removed: {
          $source: 'value2',
        },
      },
      key2: {
        key3: {
          removed: {
            $source: 'value3',
          },
        },
      },
      removed: {
        $source: 'value1',
      },
    };
    expect(interpolateDeep(o, {mapFn})).toEqual(expected);
  });
});
