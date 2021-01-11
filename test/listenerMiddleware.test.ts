import { createStore } from 'redux';
import { createMiddleware } from '../src';
import { ActionHandler } from '../src/listenerMiddleware';

afterEach(() => {
  jest.clearAllMocks();
});

const mockNext = (dispatch) => dispatch;
const mockStore = createStore((state, action) => state);

test('Should create middleware and check types', () => {
  const listenMiddleware = createMiddleware();
  expect(typeof listenMiddleware).toBe('function');
  expect(typeof listenMiddleware(mockStore)).toBe('function');
  expect(typeof listenMiddleware.addListener).toBe('function');
  expect(typeof listenMiddleware.actionHandler).toBe('object');
  expect(listenMiddleware.actionHandler instanceof ActionHandler).toBe(true);
  expect(
    listenMiddleware.listeners === listenMiddleware.actionHandler.listeners
  ).toBe(true);
  expect(
    listenMiddleware.cleanup === listenMiddleware.actionHandler.cleanup
  ).toBe(true);
});

test('Should allow multiple listeners', () => {
  const listenMiddleware = createMiddleware();

  let cnt = 0;
  listenMiddleware.addListener('TEST', () => {
    cnt += 1;
  });
  listenMiddleware.addListener('TEST', () => {
    cnt += 1;
  });

  const middleware = listenMiddleware(mockStore)(mockNext);
  middleware({ type: 'TEST' });
  expect(cnt).toBe(2);
});

test('Should listen only registerd action', () => {
  const listenMiddleware = createMiddleware();

  let cnt = 0;
  listenMiddleware.addListener('TEST', () => {
    cnt += 1;
  });

  const middleware = listenMiddleware(mockStore)(mockNext);
  middleware({ type: 'OTHER' });
  expect(cnt).toBe(0);
});

test('Should register multiple action types', () => {
  const listenMiddleware = createMiddleware();

  let increment = 0;

  listenMiddleware.addListener(['TEST', 'ANOTHER'], () => {
    increment += 1;
  });

  const middleware = listenMiddleware(mockStore)(mockNext);

  middleware({ type: 'TEST' });
  expect(increment).toBe(1);

  middleware({ type: 'ANOTHER' });
  expect(increment).toBe(2);
});

test('Should dispatch an action in other listener', () => {
  const listenMiddleware = createMiddleware();

  let increment = 0;

  listenMiddleware.addListener('TEST', (action, dispatch) => {
    expect(increment).toBe(0);

    increment += 1;

    // dispatch function of dispatchableStore
    dispatch({ type: 'ANOTHER' });
  });

  const dispatchableStore: any = {
    dispatch(action) {
      expect(increment).toBe(1);
      expect(action.type).toBe('ANOTHER');

      increment += 1;
    },
  };

  const next: any = () => expect(increment).toBe(1);

  const middleware = listenMiddleware(dispatchableStore)(next);

  middleware({ type: 'TEST' });
});

test('Should read payload of action', () => {
  const listenMiddleware = createMiddleware();
  listenMiddleware.addListener('TEST', (action) => {
    expect(action.payload).toBe(1);
  });

  const middleware = listenMiddleware(mockStore)(mockNext);
  middleware({ type: 'TEST', payload: 1 });
});

test('Should cleanup', () => {
  const listenMiddleware = createMiddleware();
  listenMiddleware.addListener('TEST', (action) => {});

  listenMiddleware.cleanup();
  expect(Object.keys(listenMiddleware.listeners).length).toBe(0);
});
