# react-action-listener

[![Version](https://img.shields.io/npm/v/react-action-listener.svg)](https://www.npmjs.com/package/react-action-listener)
[![License: MIT](https://img.shields.io/github/license/qkreltms/react-action-listener)](https://github.com/qkreltms/react-action-listener/blob/master/LICENSE)

> Middleware which allows listening actions of Context and Redux

<img width='150px' src="./imgs/Observer_SC2_Head1.jpg"/>

## Usages

### Much like `redux-saga`

```ts
import { createMiddleware } from 'react-action-listener';

const listener = createMiddleware();
// 1. Apply middleware
const store = createStore(reduce, {}, applyMiddleware(listener);

// 2. Register listener
listener.addListener((dispatch, action) => {
  // Now you can listen 'ADD' when button is pressed.
  // {"type":"ADD","payload":1}
  console.log(`${JSON.stringify(action)}`);
});

const onClickPlus = () => {
  // When button is clicked an action 'ADD' is dispatched.
  dispatch({ type: 'ADD', payload: 1 });
};

return <button onClick={onClickPlus}>add</button>;
```

### Hook

```ts
import { createMiddleware, useActionListener } from 'react-action-listener';
// 1. Apply global middleware.
const store = createStore(reduce, {}, applyMiddleware(createMiddleware()));

// 2. Use hook.
useActionListener('ADD', (dispatch, action) => {
  // Now you can listen 'ADD' when button is pressed.
  // {"type":"ADD","payload":1}
  console.log(`${JSON.stringify(action)}`);
});

const onClickPlus = () => {
  // When button is clicked an action 'ADD' is dispatched.
  dispatch({ type: 'ADD', payload: 1 });
};

return <button onClick={onClickPlus}>add</button>;
```

### Context

```ts
import { createMiddleware } from 'react-action-listener';

function increaseAction(dispatch: Dispatch<AnyAction>) {
  const action = {
    type: 'INCREASE',
    payload: 1,
  };

  // 1. Apply middleware.
  middleware(action);
  dispatch(action);
}

// 2. Use hook.
// Note: when you use Context, dispatch is not provided as parameter.
useActionListener('INCREASE', (action) => {
  // {"type":"ADD","payload":1}
});
```

### Hybrid

You can also use both hook and much like `redux-saga`

```ts
import { createMiddleware } from 'react-action-listener';
// 1. Apply global middleware.
const listenMiddleware = createMiddleware();

useActionListener('TEST', (action) => {
  //...
});

listenMiddleware.addListener('TEST', (action) => {
  // ...
});
```

## Install

```sh
npm i react-action-listener
yarn add react-action-listener
```

## Links

- [Motivation]()
- [Video tutorial]()
- Examples
  - [Counters](https://codesandbox.io/s/react-action-listener-5we8j?file=/src/reducer.ts)
  - [Counters (hook)](https://codesandbox.io/s/react-action-listener-counter-example-0dti5?file=/src/reducer.ts)
  - [Counters (Context)]()

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
