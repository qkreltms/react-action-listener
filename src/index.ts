import useActionListener, {
  UseActionListener,
} from './react/useActionListener';
import createMiddleware, { CreateMiddleware } from './listenerMiddleware';

const reduxActionListener: {
  useActionListener: UseActionListener;
  createMiddleware: CreateMiddleware;
} = {
  useActionListener,
  createMiddleware,
};
export default reduxActionListener;
export { createMiddleware, useActionListener };
