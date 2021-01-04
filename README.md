# Welcome to redux-action-listener-hook 👋

[![Version](https://img.shields.io/npm/v/redux-action-listener-hook.svg)](https://www.npmjs.com/package/redux-action-listener-hook)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/qkreltms/redux-action-listener-hook#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/qkreltms/redux-action-listener-hook/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/qkreltms/redux-action-listener-hook)](https://github.com/qkreltms/redux-action-listener-hook/blob/master/LICENSE)

> Redux middleware hook which allows listening action and handling of dispatched actions

## Usage

```ts
// 1. Register middleware
import { createMiddleware } from 'redux-action-listener-hook';

export const store = createStore(
  reduce,
  {},
  applyMiddleware(createMiddleware())
);

// 2. use hook
const onClickPlus = () => {
  // When button is clicked an action 'ADD' is dispatched.
  dispatch({ type: 'ADD', payload: 1 });
};

useActionListener('ADD', (dispatch, action) => {
  // Now you can listen 'ADD' when button is pressed.
  // {"type":"ADD","payload":1}
  console.log(`${JSON.stringify(action)}`);
});

return <button onClick={onClickPlus}>add</button>;
```

## Install

```sh
npm i redux-action-listener-hook
```

## Links

- [Motivation]()
- [Video tutorial]()
- Examples
  - [Counters](https://codesandbox.io/s/redux-action-listener-hook-counter-example-0dti5?file=/src/reducer.ts)

## Run tests

```sh
npm test
```

## Author

👤 **Jeong Hoon Park**

- Website: https://github.com/qkreltms
- Github: [@qkreltms](https://github.com/qkreltms)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/qkreltms/redux-action-listener-hook/issues). You can also take a look at the [contributing guide](https://github.com/qkreltms/redux-action-listener-hook/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Jeong Hoon Park](https://github.com/qkreltms).

This project is [MIT](https://github.com/qkreltms/redux-action-listener-hook/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
