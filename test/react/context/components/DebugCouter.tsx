import React, { createContext, useReducer, Dispatch, useContext } from 'react';
import { AnyAction } from 'redux';
import { useActionListener } from '../../../../src';
import middleware from '../middlewares/debugMiddleware';

interface CounterState {
  cnt: number;
}
interface CounterActions {
  increase: () => void;
  substract: () => void;
}
type CounterReducer = (state: CounterState, action: AnyAction) => CounterState;
interface CounterContextValues extends CounterState, CounterActions {}

const counterReducer = (
  state: CounterState,
  action: AnyAction
): CounterState => {
  switch (action.type) {
    case 'INCREASE':
      return {
        ...state,
        cnt: state.cnt + action.payload,
      };
    case 'SUB':
      return {
        ...state,
        cnt: state.cnt - action.payload,
      };
    default:
      return state;
  }
};

function increaseAction(dispatch: Dispatch<AnyAction>) {
  const action = {
    type: 'INCREASE',
    payload: 1,
  };

  middleware(action);
  dispatch(action);
}
function subAction(dispatch: Dispatch<AnyAction>) {
  const action = {
    type: 'SUB',
    payload: 1,
  };
  middleware(action);
  dispatch(action);
}
const initialValues: CounterState & CounterActions = {
  cnt: 0,
  increase: () => {},
  substract: () => {},
};
export const CounterContext = createContext<CounterContextValues>(
  initialValues
);
export function CounterProvider({ children }: { children: any }) {
  const [state, dispatch] = useReducer<CounterReducer>(
    counterReducer,
    initialValues
  );
  const actions: CounterActions = {
    increase: () => increaseAction(dispatch),
    substract: () => subAction(dispatch),
  };
  return (
    <CounterContext.Provider value={{ ...state, ...actions }}>
      {children}
    </CounterContext.Provider>
  );
}

export function Counter() {
  const { cnt, increase, substract } = useContext(CounterContext);
  return (
    <>
      <button type="button" onClick={() => increase()} data-testid="cnt">
        {cnt}
      </button>
      <button type="button" onClick={() => substract()} data-testid="sub">
        sub
      </button>
    </>
  );
}
