function createListener(type, listener) {
  return {
    type,
    listener,
  };
}

export function createMiddleware() {
  const listeners = [];

  const middleware = (store) => {
    const dispatchImmediate = (...args) => {
      setTimeout(() => store.dispatch(...args), 0);
    };

    return (next) => (action) => {
      // execute registered listeners
      listeners
        .filter(({ type }) => {
          // first check if listener type is a string match
          if (type === action.type) {
            return true;
          }

          // then check if listener type is array and has action.type
          if (type.constructor === Array && type.indexOf(action.type) > -1) {
            return true;
          }

          return false;
        })
        .map((listener) => listener.listener(dispatchImmediate, action));

      // continue middleware chain
      next(action);
    };
  };

  middleware.addListener = (type, listener) => {
    for (let i = 0; i < listeners.length; i += 1) {
      if (listeners[i].type === type) {
        return;
      }
    }
    listeners.push(createListener(type, listener));
  };

  middleware.addListeners = (type, ...listeners) => {
    listeners.map((listener) => middleware.addListener(type, listener));
  };

  middleware.getListeners = () => {
    return listeners;
  };

  middleware.deleteAll = () => {
    while (listeners.length) {
      listeners.pop();
    }
  };

  return middleware;
}
