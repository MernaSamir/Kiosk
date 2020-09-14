import applyFilters from 'helpers/functions/filters'
import {get} from 'lodash'
import test_data from './__data__/store'

test('Map Select', ()=>{
  const params = {
    key: 'mapSelect',
    select: {
      serve: 'main.current.id',
      mode: 'settings__mode.active',
      shift: 'orders__shifts.active',
      station: 'licensing__station.active',
    },
  }
  const res = {
    serve: '43d14305-8102-419e-bbb3-c80a7bf6db95',
    mode: 'f67a5567-eb3e-4694-8d4b-c4a65dfc9b2c',
    shift: '5a9f733c-1f43-4ea0-8984-0660506d8aaa',
    station: 'ff0f2684-c471-4fbd-af79-babfeff45d64',
  }
  // console.log(applyFilters(params, undefined, test_data))
  expect(applyFilters(params, undefined, test_data)).toMatchObject(res);
  expect(applyFilters(params, {}, test_data)).toMatchObject(res);
  expect(applyFilters(params, test_data, {})).toMatchObject(res);
  expect(applyFilters(params, {}, {}, {data: test_data})).toMatchObject(res);
});
test('map params Select', ()=>{
  const params = {
    key: 'mapParams',
    params: {
      serve: 'main.current.id',
      mode: 'settings__mode.active',
      shift: 'orders__shifts.active',
      station: 'licensing__station.active',
    },
  }
  const res = {
    serve: '43d14305-8102-419e-bbb3-c80a7bf6db95',
    mode: 'f67a5567-eb3e-4694-8d4b-c4a65dfc9b2c',
    shift: '5a9f733c-1f43-4ea0-8984-0660506d8aaa',
    station: 'ff0f2684-c471-4fbd-af79-babfeff45d64',
  }
  // console.log(applyFilters(params, undefined, test_data))
  expect(applyFilters(params, undefined, test_data)).toMatchObject(res);
  expect(applyFilters(params, {}, test_data)).toMatchObject(res);
  expect(applyFilters(params, test_data, {})).toMatchObject({});
  expect(applyFilters(params, {}, {}, {data: test_data})).toMatchObject(res);
});

test('Selector function', ()=>{
  const params = {
    key: 'Selector',
    path: 'licensing__station.active',
  }
  const res = {number: 10}
  const extra = {'ff0f2684-c471-4fbd-af79-babfeff45d64': res}
  expect(applyFilters(params, extra, test_data)).toMatchObject(res);
  expect(applyFilters(params, {}, test_data)).toBe('');
  expect(applyFilters(params, undefined, test_data)).toBe('');
})
test('State Selector function', ()=>{
  const params = {
    key: 'StateSelector',
    path: 'licensing__station',
  }
  const res = get(test_data, 'licensing__station')
  expect(applyFilters(params, {}, test_data)).toMatchObject(res);
  expect(applyFilters(params, test_data, {})).toBe('');
})
