import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import debugMiddleware from './middlewares/debugMiddleware';
import {
  CounterProvider as DebugCounterProvider,
  Counter as DebugCounter,
} from './components/DebugCouter';

beforeAll(() => {});
afterEach(() => {
  cleanup();
  debugMiddleware.cleanup();
  jest.clearAllMocks();
});
afterAll(() => {});

test('Should logs are called when isDebugContext = true', () => {
  const spy = jest.spyOn(console, 'log');

  render(
    <DebugCounterProvider>
      <DebugCounter />
    </DebugCounterProvider>
  );
  const button = screen.getByTestId('cnt');
  debugMiddleware.addListener('INCREASE', (action) => {});
  fireEvent.click(button);

  expect(spy).toBeCalledTimes(2);
});
