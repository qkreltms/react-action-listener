import { createContext } from 'react';
import { createMiddleware } from '../index';

const Context = createContext({ createMiddleware });
export const ListenerProvider = Context.Provider;
export default Context;
