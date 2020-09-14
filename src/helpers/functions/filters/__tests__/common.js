import applyFilters from 'helpers/functions/filters'
import {get} from 'lodash'
import test_data from './__data__/store'

test('Find Function', ()=>{
  const hq = get(test_data, `dropdowns__delivery_service_mode.data.054c512c-4885-4ea9-891d-538321b80ce2`, {})
  const data = applyFilters({
    key: 'Find',
    path: 'dropdowns__delivery_service_mode',
    params: {
      service: 'ub',
    }}, undefined, test_data)
  expect(data).toMatchObject(hq);
});
test('Filter Function', ()=>{
  const data = applyFilters({
    key: 'Filter',
    path: 'dropdowns__delivery_service_mode',
    params: {
      service: 'ub',
    }}, undefined, test_data)
  expect(data.length).toBe(2);
});
test('Compare Function', ()=>{
  const params = {
    key: 'compare',
    path: 'dropdowns__delivery_service_mode',
    to: 'number',
    val: 3,
  }
  expect(applyFilters(params, undefined, test_data).length).toBe(1);
  expect(applyFilters({...params, compare: 'eq'}, undefined, test_data).length).toBe(1);
  expect(applyFilters({...params, compare: 'eq', to: 'service', val: 'ubs'}, undefined, test_data).length).toBe(1);
  expect(applyFilters({...params, compare: 'eq', to: 'service', val: 'ub'}, undefined, test_data).length).toBe(2);
  expect(applyFilters({...params, compare: 'lt', val: 1}, undefined, test_data).length).toBe(2);
  expect(applyFilters({...params, compare: 'lt', val: 0}, undefined, test_data).length).toBe(3);
  expect(applyFilters({...params, compare: 'lte', val: 1}, undefined, test_data).length).toBe(3);
  expect(applyFilters({...params, compare: 'gt', val: 10}, undefined, test_data).length).toBe(2);
  expect(applyFilters({...params, compare: 'gt', val: 11}, undefined, test_data).length).toBe(3);
  expect(applyFilters({...params, compare: 'gte', val: 10}, undefined, test_data).length).toBe(3);
});

test('Delayed Time', ()=>{
  const params = {
    key: 'Delayed',
    delay: 1000,
    fun: {
      path: 'dropdowns__delivery_service_mode',
    },
  }
  jest.useFakeTimers()
  const time = applyFilters(params, undefined, test_data)
  // At this point in time, the callback should not have been called yet
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(time).toBeUndefined();
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
})

test('First Choose', ()=>{
  const res = get(test_data, `dropdowns__delivery_service_mode.data.054c512c-4885-4ea9-891d-538321b80ce2`, {})
  const params = {
    key: 'First',
    path: 'dropdowns__delivery_service_mode',
  }
  expect(applyFilters({...params, display: 'number'}, undefined, test_data)).toBe(10);
  expect(applyFilters(params, undefined, test_data)).toMatchObject(res);
  expect(applyFilters({...params, display: 'x'}, undefined, test_data)).toMatchObject(res);
  expect(applyFilters({...params, default: 10}, undefined, test_data)).toMatchObject(res);
  expect(applyFilters({...params, default: 10}, {}, test_data)).toBe(10);
  expect(applyFilters({...params, display: 'number', default: {number: 20}}, {}, test_data)).toMatchObject({number: 20});
})
test('reverse key', ()=>{
  const data = {
    id1: {id2: {id: 10}},
    id2: {id2: {id: 10}},
    id3: {id2: {id: 10}},
    id4: {id: 10},
  }
  const params = {
    key: 'reverseKeys',
    levels: ['key1', 'key2'],
  }
  expect(applyFilters(params, data, test_data).length).toBe(3);
})
test('reverse key', ()=>{
  const data = {
    id1: {id2: {id: 10}},
    id2: {id2: {id: 10}},
    id3: {id2: {id: 10}},
    id4: {id: 10},
  }
  const params = {
    key: 'reverseKeys',
    levels: ['key1', 'key2'],
  }
  expect(applyFilters(params, data, test_data).length).toBe(3);
})
test('state Selector Choose', ()=>{
  const res = get(test_data, `dropdowns__delivery_service_mode.data.054c512c-4885-4ea9-891d-538321b80ce2`, {})
  const params = {
    key: 'StateSelector',
    path: 'dropdowns__delivery_service_mode.data',
  }
  expect(applyFilters({...params, select: 'id'}, {id: '054c512c-4885-4ea9-891d-538321b80ce2'}, test_data)).toMatchObject(res);
  expect(applyFilters({...params, path: params.path+'.054c512c-4885-4ea9-891d-538321b80ce2'}, undefined, test_data)).toMatchObject(res);
  expect(applyFilters({...params, path: 'xasd', default: 'x'}, undefined, test_data)).toBe('x');
  expect(applyFilters({...params, path: 'xasd'}, undefined, test_data)).toBe('');
})

