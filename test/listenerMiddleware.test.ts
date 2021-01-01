import createMiddleware from '../lib/listenerMiddleware';

const mockStore = {
  dispatch() {},
};

test('Creating middleware and type check', () => {
  const listenMiddleware = createMiddleware();
  expect(typeof listenMiddleware).toBe("function")
  expect(typeof listenMiddleware()).toBe('function')
  expect(typeof listenMiddleware.addListener).toBe('function')
})

test('Allow duplicated listener', () => {
  const listenMiddleware = createMiddleware();

  let cnt = 0;
  listenMiddleware.addListener('TEST', () => {
    cnt += 1;
  });
  listenMiddleware.addListener('TEST', () => {
    cnt += 1;
  });

  const middleware = listenMiddleware(mockStore)(() => {});
  middleware({ type: 'TEST' });
  expect(cnt).toBe(2)
});

test('Ability to register multiple action types', () => {
  const listenMiddleware = createMiddleware();

  let increment = 0;

  listenMiddleware.addListener(['TEST', 'ANOTHER'], () => {
    increment += 1;
  });

  const middleware = listenMiddleware(mockStore)(() => {});

  middleware({ type: 'TEST' });
  expect(increment).toBe(1)

  middleware({ type: 'ANOTHER' });
  expect(increment).toBe(2)
});

test('Dispatch an action in other listener', () => {
  const listenMiddleware = createMiddleware();

  let increment = 0;

  listenMiddleware.addListener('TEST', (dispatch) => {
    expect(increment).toBe(0);

    increment += 1;

    // dispatch function of dispatchableStore
    dispatch({ type: 'ANOTHER' });
  });

  const dispatchableStore = {
    dispatch(action) {
      expect(increment).toBe(1)
      expect(action.type).toBe('ANOTHER')

      increment += 1;
    },
  };

  const next = () =>
    expect(increment).toBe(2)
  const middleware = listenMiddleware(dispatchableStore)(next);

  middleware({ type: 'TEST' });
});
