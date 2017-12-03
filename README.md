# Redux Action Middleware

Redux middleware which allows the user to acts upon fired action types to the store.

```
npm install --save redux-action-middleware
```

## Who needs this?

For those who want to listen to actions dispatched on the Redux store and act upon them.

Includes the store's dispatch to execute actions when a listener is fired.

## Example

```js
import { createStore, applyMiddleware } from 'redux';
import { createMiddleware } from 'redux-action-middleware';

// import your reducers
import rootReducer from './reducers'; 

// create action middleware
const actionMiddleware = createMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(actionMiddleware),
);

// register listeners to middleware
actionMiddleware.addListener('INIT', (dispatch) => {
  dispatch({ type: 'FETCH_DATA' });
});

actionMiddleware.addListener('FETCH_DATA', (dispatch) => {
  fetch('/some-data')
    .then(response => response.text())
    .then(text => dispatch({ type: 'FETCH_DATA_SUCCESS', payload: text }))
    .catch(err => dispatch({ type: 'FETCH_DATA_FAILED', payload: err }));
});

actionMiddleware.addListener('FETCH_DATA_FAILED', (dispatch, action) => {
  // display the error in console by reading the action
  console.error(action.payload.message);
});

store.dispatch({ type: 'INIT' });
  // This will fire the 'INIT' listener
  // Which in turn dispatched the 'FETCH_DATA' action
  // 'FETCH_DATA' listener is fired and synchronously dispatches response actions
```

## Usage

### `createMiddleware()`
Creates the middleware you can pass into Redux.

*Returns* `middleware: Function`

### `middleware.addListener(actionType, listener)`
Binds `listener` function for each `actionType` dispatched to the redux store.

- `actionType: String | Array` The action type or an array of action types to match.
- `listener: Function(dispatch, action)` The function which will be called when an action of specified types is dispatched. Will receive `dispatch` and `action` as arguments to dispatch new actions and read the action being dispatched.

### `middleware.addListeners(actionType, ...listeners)`

- `actionType: String | Array` Same as `.addListener`.
- `...listeners: Array<Function(dispatch, action)>` Same as `.addListener`, but now a list of multiple listeners.

## License
MIT