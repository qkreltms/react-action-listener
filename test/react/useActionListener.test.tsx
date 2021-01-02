import React from "react"
import { renderHook } from '@testing-library/react-hooks'
import { createStore } from "redux"
import useActionListener from "../../src/react/useActionListener"
import createMiddleware from "../../src/listenerMiddleware"

const mockNext = (dispatch) => dispatch
const mockStore = createStore((state, action) => state) 
const defaultHash = 'TEST'

/**
 * NOTE:
 * When createMiddleware() is defined, it affects every test cases,
 * so you should test wether middleware is attatched on store firstly. 
 */
test('Should warn when middleware is not attached on store', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    renderHook(() => useActionListener(['TEST'],  () =>{}))
    expect(expect(console.warn).toBeCalled())
    spy.mockRestore();
})

test('Should listen an action', () => {
    const listenMiddleware = createMiddleware();
    let cnt = 0
    renderHook(() => useActionListener('TEST',  () =>{
        cnt += 1
    }))

    const middleware = listenMiddleware(mockStore)(mockNext);
    middleware({ type: 'TEST' });

    expect(cnt).toBe(1)
})

test('Should apply latest callback', () => {
    const listenMiddleware = createMiddleware();
    let cnt = 0
    let cb = () => { cnt = 1}
    const { rerender } = renderHook(() => useActionListener('TEST',  cb))

    cb = () => { cnt = 2}
    rerender()

    const middleware = listenMiddleware(mockStore)(mockNext);
    middleware({ type: 'TEST' });

    expect(cnt).toBe(2)
})

test('Should remove first listener when component unmounted', () => {
    const listenMiddleware = createMiddleware();
    const mockAction = 'TEST'
    const { rerender } = renderHook(({action}) => useActionListener(action,  () =>{}), { initialProps: { action: mockAction }})

    const middleware = listenMiddleware(mockStore)(mockNext);
    middleware({ type: 'TEST' });
    expect(Object.keys(listenMiddleware.listeners).length).toBe(1)
    rerender({action: 'OCCURS_UNMOUNT'})
    expect(Object.keys(listenMiddleware.listeners).length).toBe(1)
})

test('Should register multiple listeners with same action name', () => {
    const listenMiddleware = createMiddleware();
    let cnt = 0
    renderHook(() => useActionListener('TEST',  () =>{
        cnt += 1
    }))
    renderHook(() => useActionListener('TEST',  () =>{
        cnt += 1
    }))

    const middleware = listenMiddleware(mockStore)(mockNext);
    middleware({ type: 'TEST' });
    expect(Object.keys(listenMiddleware.listeners).length).toBe(2)
})

test('Should register multiple listeners with same action name', () => {
    const listenMiddleware = createMiddleware();
    let cnt = 0
    renderHook(() => useActionListener(['TEST', 'ANOTHER'],  () =>{
        cnt += 1
    }))

    const middleware = listenMiddleware(mockStore)(mockNext);
    middleware({ type: 'TEST' });
    expect(Object.keys(listenMiddleware.listeners).length).toBe(1)
    middleware({ type: 'ANOTHER' });
    expect(expect(cnt).toBe(2))
})