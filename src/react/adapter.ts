import { ActionHandler } from '../listenerMiddleware';

// TODO: provide adapter by using provider
export class Adapter {
  static actionHandler: ActionHandler | undefined;
}

const reactAdapter = (actionHandler: ActionHandler) => {
  Adapter.actionHandler = actionHandler;
};

export default reactAdapter;
