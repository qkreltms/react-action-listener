# react-action-listener

[![Version](https://img.shields.io/npm/v/react-action-listener.svg)](https://www.npmjs.com/package/react-action-listener)
[![License: MIT](https://img.shields.io/github/license/qkreltms/react-action-listener)](https://github.com/qkreltms/react-action-listener/blob/master/LICENSE)

> Middleware which allows listening actions of Context and Redux

<img width='150px' src="./imgs/Observer_SC2_Head1.jpg"/>

## Usage

```ts
// 1. Register middleware
import { createMiddleware, useActionListener } from 'react-action-listener';

export const store = createStore(
  reduce,
  {},
  applyMiddleware(createMiddleware())
);

const onClickPlus = () => {
  // When button is clicked an action 'ADD' is dispatched.
  dispatch({ type: 'ADD', payload: 1 });
};

// 2. use hook
useActionListener('ADD', (dispatch, action) => {
  // Now you can listen 'ADD' when button is pressed.
  // {"type":"ADD","payload":1}
  console.log(`${JSON.stringify(action)}`);
});

return <button onClick={onClickPlus}>add</button>;
```

## Install

```sh
npm i react-action-listener
```

## Links

- [Motivation]()
- [Video tutorial]()
- Examples
  - [Counters](https://codesandbox.io/s/react-action-listener-counter-example-0dti5?file=/src/reducer.ts)

## Run tests

```sh
npm test
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/qkreltms/react-action-listener/issues). You can also take a look at the [contributing guide](https://github.com/qkreltms/react-action-listener/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## Author

👤 **Jeong Hoon Park**

## Contributors

<br/>

## 📝 License

Copyright © 2021 [Jeong Hoon Park](https://github.com/qkreltms).

This project is [MIT](https://github.com/qkreltms/react-action-listener/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
