import React, { useEffect, useRef } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { ActionType } from '../listenerMiddleware';
import getUniqueHash from '../utills/generateUniqueId';
import { Adapter } from './adapter';

const useActionListener = (
  actionName: ActionType,
  cb: (dispatch?: Dispatch, action?: AnyAction) => void
) => {
  const cbRef = useRef(cb);
  const hash = getUniqueHash();
  const { actionHandler } = Adapter;
  if (!actionHandler) {
    throw new Error(
      'middleware is not attached on your store, it will not listen your actions.'
    );
  }

  useEffect(() => {
    cbRef.current = cb;
  });

  useEffect(() => {
    actionHandler?.addListener(hash, actionName, (dispatch, action) => {
      cbRef.current(dispatch, action);
    });
    return () => {
      actionHandler?.removeListener(hash);
    };
  }, [actionName]);
};

export default useActionListener;
