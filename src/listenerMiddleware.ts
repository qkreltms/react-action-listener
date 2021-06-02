import { AnyAction, Dispatch, Store } from 'redux';
import reactAdapter from './react/adapter';
import getUniqueHash from './utills/generateUniqueId';
import formatTime from './utills/time';

export type ListenerActionType = string | Array<string>;
export interface ListenerAction extends AnyAction {
  type: ListenerActionType;
}
export interface DispatchedActionWithType extends AnyAction {
  type: string;
}

export type Listener = (
  action: AnyAction,
  // eslint-disable-next-line no-shadow
  dispatch?: (action: AnyAction) => void
) => void;

interface ListenerTemplate {
  type: ListenerActionType;
  listener: Listener;
}

export class ActionHandler {
  public listeners: Map<string, ListenerTemplate>;

  constructor() {
    this.listeners = new Map();
  }

  addListener = (
    hash: string,
    type: ListenerActionType,
    listener: Listener
  ) => {
    this.listeners.set(hash, { type, listener });
  };

  removeListener = (hash: string) => {
    this.listeners.delete(hash);
  };

  cleanup = () => {
    this.listeners.clear();
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
  isContext?: boolean;
  isDebugContext?: boolean;
}
export interface CreateMiddleware {
  (config?: MiddlewareConfig): ListenerStore;
}

const createMiddleware: CreateMiddleware = (config) => {
  const actionHandler = new ActionHandler();
  const timeStyles = `color: gray; font-weight: lighter;`;
  const actionTitleStyles = `color: '#03A9F4'; font-weight: bold`;

  const middleware: any = config?.isContext
    ? (action: DispatchedActionWithType) => {
        actionHandler.listeners.forEach(({ type, listener }) => {
          let flag = false;
          if (type === action.type) {
            flag = true;
          }

          // then check if listener type is array and has action.type
          if (type.constructor === Array && type.indexOf(action.type) > -1) {
            flag = true;
          }
          if (flag) {
            listener(action);
            if (config.isDebugContext) {
              const time = formatTime(new Date());
              console.group();
              console.log(`${action.type} %c@`, timeStyles, time);
              console.log(
                '%c action    ',
                actionTitleStyles,
                JSON.stringify(action)
              );
              console.groupEnd();
            }
          }
        });
      }
    : (store: Store) => {
        // By using this we can ensure anothter action in listener
        // can be dispatched after the dispatching action is compeleted.
        const dispatchImmediate = (action: AnyAction) => {
          setTimeout(() => store.dispatch(action), 0);
        };
        return (next: Dispatch<AnyAction>) => (
          action: DispatchedActionWithType
        ) => {
          actionHandler.listeners.forEach(({ type, listener }) => {
            let flag = false;
            if (type === action.type) {
              flag = true;
            }

            // then check if listener type is array and has action.type
            if (type.constructor === Array && type.indexOf(action.type) > -1) {
              flag = true;
            }

            if (flag) {
              listener(action, dispatchImmediate);
            }
          });

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
