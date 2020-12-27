import test from 'tape';

import createMiddleware from '../lib/listenerMiddleware';

const mockStore = {
  dispatch() {},
};

test('Creating middleware', (t) => {
  const listenMiddleware = createMiddleware();

  t.equal(typeof listenMiddleware, 'function', 'Should return a function');
  t.equal(
    typeof listenMiddleware(),
    'function',
    'Should return a function returning a function'
  );
  t.equal(
    typeof listenMiddleware.addListener,
    'function',
    'Should have addListener function'
  );

  t.end();
});

test('Allow duplicated listener', (t) => {
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
  t.equal(cnt, 2);
  t.end();
});

test('Ability to register multiple action types', (t) => {
  const listenMiddleware = createMiddleware();

  let increment = 0;

  listenMiddleware.addListener(['TEST', 'ANOTHER'], () => {
    increment += 1;
  });

  const middleware = listenMiddleware(mockStore)(() => {});

  middleware({ type: 'TEST' });
  t.equal(increment, 1, 'Listen to first action type');

  middleware({ type: 'ANOTHER' });
  t.equal(increment, 2, 'Listen to second action type');

  t.end();
});

test('Dispatch an action in other listener', (t) => {
  const listenMiddleware = createMiddleware();

  let increment = 0;

  listenMiddleware.addListener('TEST', (dispatch) => {
    t.equal(increment, 0, 'First fire listener');

    increment += 1;

    // dispatch function of dispatchableStore
    dispatch({ type: 'ANOTHER' });
  });

  const dispatchableStore = {
    dispatch(action) {
      t.equal(increment, 1);
      t.equal(action.type, 'ANOTHER');

      increment += 1;
    },
  };

  const next = () =>
    t.equal(increment, 2, 'Call next middleware after listeners');
  const middleware = listenMiddleware(dispatchableStore)(next);

  middleware({ type: 'TEST' });
  t.end();
});
