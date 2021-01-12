import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import {
  CounterProvider,
  Counter,
  CounterWithHook,
  CounterWithHookAndDispatch,
} from './context/components/MiddlewareOnReducerCounter';
import {
  CounterWithHookAndDispatch2,
} from './context/components/MiddlewareBeforeDispatchCounter';
import middleware from './context/middleware';

beforeAll(() => {});
afterEach(() => {
  cleanup();
  middleware.cleanup();
  jest.clearAllMocks();
});
afterAll(() => {});

test('Should read action.payload', () => {
  render(
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
  const button = screen.getByTestId('cnt');
  middleware.addListener('INCREASE', (action) => {
    expect(action.payload).toBe(1);
  });
  expect(button.innerHTML).toBe('0');
  fireEvent.click(button);
  expect(button.innerHTML).toBe('1');
});

test('Should read multiple actions', () => {
  render(
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
  const cntButton = screen.getByTestId('cnt');
  const subButton = screen.getByTestId('sub');
  middleware.addListener(['INCREASE', 'SUB'], (action) => {
    expect(action.payload).toBe(1);
  });
  fireEvent.click(subButton);
  expect(cntButton.innerHTML).toBe('-1');
  fireEvent.click(cntButton);
  expect(cntButton.innerHTML).toBe('0');
});

test('Should use as hybrid', async () => {
  const spy = jest.spyOn(middleware.actionHandler, 'addListener');
  middleware.addListener('INCREASE', (action) => {
    expect(action.payload).toBe(1);
  });

  render(
    <CounterProvider>
      <CounterWithHook />
    </CounterProvider>
  );

  expect(Object.keys(middleware.listeners).length).toBe(2);
  const cntButton = screen.getByTestId('cnt');
  fireEvent.click(cntButton);
  expect(spy).toBeCalledTimes(2);
});

test('Should use dispatch in listener', async () => {
  const spy = jest.spyOn(middleware.actionHandler, 'addListener');
  middleware.addListener('SUB', (action) => {
    expect(action.payload).toBe(1);
  });

  render(
    <CounterProvider>
      <CounterWithHookAndDispatch />
    </CounterProvider>
  );

  expect(Object.keys(middleware.listeners).length).toBe(2);
  const cntButton = screen.getByTestId('cnt');
  fireEvent.click(cntButton);
  expect(spy).toBeCalledTimes(2);
  // NOTE: dispatching an action in reducer is ANTI-PATTERN (https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
  // At first INCREASE is dispatched and sets cnt to 1
  // Next SUB is dispatched and sets cnt to 0 becuase we wrapped substract with setTimeout
  // wait for these async change
  await waitFor(() => {
    expect(screen.getByText('0')).toBeDefined();
  });
});

test('Should use dispatch in listener', async () => {
  const spy = jest.spyOn(middleware.actionHandler, 'addListener');
  middleware.addListener('SUB', (action) => {
    expect(action.payload).toBe(1);
  });

  render(
    <CounterProvider>
      <CounterWithHookAndDispatch2 />
    </CounterProvider>
  );

  expect(Object.keys(middleware.listeners).length).toBe(2);
  const cntButton = screen.getByTestId('cnt');
  fireEvent.click(cntButton);
  expect(spy).toBeCalledTimes(2);
  await waitFor(() => {
    expect(screen.getByText('0')).toBeDefined();
  });
});
