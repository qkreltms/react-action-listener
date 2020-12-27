import { AnyAction, Dispatch, Store } from 'redux';

type ActionType = string | Array<string>;
interface Listener {
  (dispatch?: Dispatch, action?: AnyAction): void;
}
interface ListenerTemplate {
  type: ActionType;
  listener: Listener;
}

export default function createMiddleware() {
  const listeners: ListenerTemplate[] = [];

  const middleware = (store: Store) => (next: Dispatch<AnyAction>) => (
    action: any
  ) => {
    listeners
      .filter(({ type }) => {
        if (type === action.type) {
          return true;
        }

        // then check if listener type is array and has action.type
        if (type.constructor === Array && type.indexOf(action.type) > -1) {
          return true;
        }

        return false;
      })
      .map((listener) => listener.listener(store.dispatch, action));

    // continue middleware chain
    next(action);
  };

  middleware.addListener = (type: ActionType, listener: Listener) => {
    listeners.push({ type, listener });
  };

  return middleware;
}
