# react-action-listener

[![Version](https://img.shields.io/npm/v/react-action-listener.svg)](https://www.npmjs.com/package/react-action-listener)
[![License: MIT](https://img.shields.io/github/license/qkreltms/react-action-listener)](https://github.com/qkreltms/react-action-listener/blob/master/LICENSE)

> Middleware which allows listening actions of Context and Redux

<img width='150px' src="./imgs/Observer_SC2_Head1.jpg"/>

## Install

```sh
npm i react-action-listener
yarn add react-action-listener
```

## Usages

### Much like `redux-saga`

```ts
import { createMiddleware } from 'react-action-listener';

const middleware = createMiddleware();
// 1. Apply middleware.
const store = createStore(reduce, {}, applyMiddleware(middleware);

// 2. Register listener.
middleware.addListener((action, dispatch) => {
  // Now you can listen 'ADD' when button is pressed.
  // {"type":"ADD","payload":1}
  console.log(`${JSON.stringify(action)}`);
});

const onClickPlus = () => {
  // When button is clicked an action 'ADD' is dispatched.
  store.dispatch({ type: 'ADD', payload: 1 });
};

return <button onClick={onClickPlus}>add</button>;
```

### Hook

```ts
import { createMiddleware, useActionListener } from 'react-action-listener';
// 1. Apply global middleware.
const store = createStore(reduce, {}, applyMiddleware(createMiddleware()));

// 2. Use hook.
useActionListener('ADD', (action, dispatch) => {
  // Now you can listen 'ADD' when button is pressed.
  // {"type":"ADD","payload":1}
  console.log(`${JSON.stringify(action)}`);
});

const onClickPlus = () => {
  // When button is clicked an action 'ADD' is dispatched.
  store.dispatch({ type: 'ADD', payload: 1 });
};

return <button onClick={onClickPlus}>add</button>;
```

### Context

```ts
import { createMiddleware, useActionListener } from 'react-action-listener';
// Note: you must provide config.isContext = true;
const middleware = createMiddleware({ isContext: true });

const [state, dispatch] = useReducer(counterReducer, initialValues);

function increaseAction(dispatch) {
  const action = {
    type: 'ADD',
    payload: 1,
  };

  // 1. Apply middleware.
  middleware(action);
  dispatch(action);
}

// 2. Use hook.
// Note: when you use Context, dispatch is not provided as parameter.
useActionListener('ADD', (action) => {
  // {"type":"ADD","payload":1}
  console.log(`${JSON.stringify(action)}`);
});
```

### Hybrid

You can also mix up.

```ts
import { createMiddleware, useActionListener } from 'react-action-listener';
// 1. Apply global middleware.
const middleware = createMiddleware();

useActionListener('ADD', (action, dispatch) => {
  //...
});

middleware.addListener('ADD', (action, dispatch) => {
  // ...
});
```

## Links

- [Motivation]()
- [Video tutorial]()
- Examples

  - [Counters](https://codesandbox.io/s/react-action-listener-5we8j?file=/src/reducer.ts)
  - [Counters (hook)](https://codesandbox.io/s/react-action-listener-counter-example-0dti5?file=/src/reducer.ts)
  - [Counters (Context)](https://codesandbox.io/s/react-action-listener-context-s748z?file=/src/Counter.tsx)

    See also [here](./examples)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/qkreltms/react-action-listener/issues). You can also take a look at the [contributing guide](https://github.com/qkreltms/react-action-listener/blob/master/CONTRIBUTING.md).

## Contributors

👤 **Jeong Hoon Park**
<br/>

## 📝 License

Copyright © 2021 [Jeong Hoon Park](https://github.com/qkreltms).

This project is [MIT](https://github.com/qkreltms/react-action-listener/blob/master/LICENSE) licensed.

---
