import { AnyAction, Dispatch, Store } from 'redux';

type ActionType = string;
interface Listener {
  (dispatch: Dispatch, action: AnyAction): void;
}
interface ListenerTemplate {
  type: ActionType;
  listener: Listener;
}
function createListener(
  type: ActionType,
  listener: Listener
): ListenerTemplate {
  return {
    type,
    listener,
  };
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

        return false;
      })
      .map((listener) => listener.listener(store.dispatch, action));

    // continue middleware chain
    next(action);
  };

  middleware.addListener = (type: ActionType, listener: Listener) => {
    listeners.push(createListener(type, listener));
  };

  return middleware;
}
