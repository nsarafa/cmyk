/* @flow */

import fetch from 'isomorphic-fetch';
import { call, put, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST, loginSuccess, loginFailure } from 'state/session/actions';
import type { IOEffect } from 'redux-saga/effects';
import type { Action } from 'state/types';

const postLogin = (username: string, password: string): Promise<{ token: string }> =>
  fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }).then(resp => resp.json());

export function* loginRequested(action: Action): Generator<IOEffect, void, string> {
  if (action.type !== LOGIN_REQUEST) {
    throw new TypeError(`Invalid action. Expected ${LOGIN_REQUEST}, not ${action.type}.`);
  }
  try {
    const token = yield call(postLogin, action.payload.username, action.payload.password);
    yield put(loginSuccess(token));
  } catch (err) {
    yield put(loginFailure(err));
  }
}

export default function* sessionSaga(): Generator<IOEffect, void, string> {
  yield takeLatest(LOGIN_REQUEST, loginRequested);
}