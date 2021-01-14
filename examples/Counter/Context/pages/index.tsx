import React, { createContext, Dispatch, useContext, useReducer, useState } from "react";
import { createMiddleware, useActionListener } from "react-action-listener";


export default function App() {
  return (
    <CounterProvider>
      <div>
        <h3>Simple Counter</h3>
        <MyCounter />
      </div>
    </CounterProvider>
  )
}


export interface CombineReducers {
  counter: CounterState;
}
export interface CounterState {
  count: number;
}
export const initialState: CounterState = {
  count: 0
};

export function counter(state = initialState, action: any) {
  switch (action.type) {
    case "ADD":
      return { count: state.count + action.payload };
    case "SUB":
      return { count: state.count - action.payload };
    default:
      return state;
  }
}

const middleware = createMiddleware({ isContext: true });

function increaseAction(dispatch: Dispatch<any>) {
  const action = {
    type: "ADD",
    payload: 1
  };

  middleware(action);
  dispatch(action);
}
function subAction(dispatch: Dispatch<any>) {
  const action = {
    type: "SUB",
    payload: 1
  };
  middleware(action);
  dispatch(action);
}

export const CounterContext = createContext(
  initialState
);

export function CounterProvider({ children }: any) {
  const [state, dispatch] = useReducer(
    counter,
    initialState
  );
  const actions = {
    increase: () => increaseAction(dispatch),
    substract: () => subAction(dispatch)
  };
  return (
    <CounterContext.Provider value={{ ...state, ...actions }}>
      {children}
    </CounterContext.Provider>
  );
}

export function MyCounter() {
  const { count, increase, substract } = useContext<any>(CounterContext);
  const [curAction, setAction] = useState<any>({})

  useActionListener("SUB", (action) => {
    setAction(action)
  });
  useActionListener("ADD", (action) => {
    setAction(action)
  });

  return (
    <>
      <button type="button" onClick={() => increase()} data-testid="cnt">
        add
      </button>
      <button type="button" onClick={() => substract()} data-testid="sub">
        sub
      </button>
      <p>{count}</p>
      <pre>{JSON.stringify(curAction)}</pre>
    </>
  );
}