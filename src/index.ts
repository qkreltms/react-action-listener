import useActionListener from './react/useActionListener';
import createMiddleware from './listenerMiddleware';

const reduxActionListener: any = {};
reduxActionListener.useActionListener = useActionListener;
reduxActionListener.createMiddleware = createMiddleware;
export default reduxActionListener;
export { createMiddleware, useActionListener };
