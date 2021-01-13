import { AnyAction, Dispatch, Store } from 'redux';
import reactAdapter from './react/adapter';
import getUniqueHash from './utills/generateUniqueId';

export type ListenerActionType = string | Array<string>;
export interface ListenerAction extends AnyAction {
  type: ListenerActionType;
}
export interface DispatchedActionWithType extends AnyAction {
  type: string;
}

export interface Listener {
  // eslint-disable-next-line no-shadow
  (action: AnyAction, dispatch?: (action: AnyAction) => void): void;
}
interface ListenerTemplate {
  type: ListenerActionType;
  listener: Listener;
}

export class ActionHandler {
  public listeners: { [key: string]: ListenerTemplate };

  constructor() {
    this.listeners = {};
  }

  addListener = (
    hash: string,
    type: ListenerActionType,
    listener: Listener
  ) => {
    this.listeners[hash] = { type, listener };
  };

  removeListener = (hash: string) => {
    delete this.listeners[hash];
  };

  cleanup = () => {
    const keys = Object.keys(this.listeners);
    for (let i = 0; i < keys.length; i += 1) {
      delete this.listeners[keys[i]];
    }
  };
}
export interface ListenerStore
  extends Omit<ActionHandler, 'addListener' | 'removeListener'> {
  actionHandler: ActionHandler;
  addListener: (type: ListenerActionType, listener: Listener) => void;
  (store: Store): (
    next: Dispatch<AnyAction>
  ) => (action: DispatchedActionWithType) => void;
  (action: DispatchedActionWithType): void;
}

interface MiddlewareConfig {
  isContext: boolean;
}
export interface CreateMiddleware {
  (config?: MiddlewareConfig): ListenerStore;
}

const createMiddleware: CreateMiddleware = (config) => {
  const actionHandler = new ActionHandler();

  const middleware: any = config?.isContext
    ? (action: DispatchedActionWithType) => {
        Object.values(actionHandler.listeners)
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
          .map((listener) => listener.listener(action));
      }
    : (store: Store) => {
        // TODO: describe this on docs
        // By using this function we can ensure
        // an dispatch in action to be run after the action is compelete.
        const dispatchImmediate = (action: AnyAction) => {
          setTimeout(() => store.dispatch(action), 0);
        };
        return (next: Dispatch<AnyAction>) => (
          action: DispatchedActionWithType
        ) => {
          Object.values(actionHandler.listeners)
            .filter(({ type }) => {
              if (type === action.type) {
                return true;
              }

              // then check if listener type is array and has action.type
              if (
                type.constructor === Array &&
                type.indexOf(action.type) > -1
              ) {
                return true;
              }

              return false;
            })
            .map((listener) => listener.listener(action, dispatchImmediate));

          // continue middleware chain
          next(action);
        };
      };

  middleware.listeners = actionHandler.listeners;
  middleware.addListener = (type: ListenerActionType, listener: Listener) => {
    const hash = getUniqueHash();
    actionHandler.addListener(hash, type, listener);
  };
  middleware.actionHandler = actionHandler;
  middleware.cleanup = actionHandler.cleanup;

  reactAdapter(middleware.actionHandler);
  return middleware;
};

export default createMiddleware;
