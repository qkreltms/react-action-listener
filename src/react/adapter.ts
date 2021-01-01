import { ActionHandler } from '../listenerMiddleware';

export class Adapter {
  static actionHandler: ActionHandler | undefined;
}

const reactAdapter = (actionHandler: ActionHandler) => {
  Adapter.actionHandler = actionHandler;
};

export default reactAdapter;
