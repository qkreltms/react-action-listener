import { createMiddleware } from '../../../../src';

// gloabl middleware
const middleware = createMiddleware({ isContext: true, isDebugContext: true });
export default middleware;
