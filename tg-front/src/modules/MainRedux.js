import { createAction, handleActions } from "redux-actions"
import produce from "immer"
import { put, call, takeLatest } from "redux-saga/effects"
import * as TwitterAuthAPI from "../libs/apis/TwitterAuthAPI"

const TWITTER_LOGIN = "auth.twitter_login"
const TWITTER_LOGIN_SUCCESS = "auth.twitter_login_SUCCESS"
const TWITTER_LOGIN_FAILURE = "auth.twitter_login_FAILURE"
const TWITTER_LOGIN_LOADING = "auth.twitter_login_LOADING"

export const twitterLogin = createAction(TWITTER_LOGIN)
export const twitterLoginLoading = createAction(TWITTER_LOGIN_LOADING, loading => loading)

const twitterLoginSaga = function*(action) {
    yield put(twitterLoginLoading(true))        // Start loading...

    try {
        const response = yield call(TwitterAuthAPI.checkIsAuthed, action.payload)
        yield put({
            type: TWITTER_LOGIN_SUCCESS,
            payload: response.data,
            meta: response,
            error: false
        })
    } catch(ex) {
        yield put({
            type: TWITTER_LOGIN_FAILURE,
            payload: ex,
            meta: null,
            error: true
        })
    }

    yield put(twitterLoginLoading(false))        // Stop loading...
}

export function* mainSaga() {
    yield takeLatest(TWITTER_LOGIN, twitterLoginSaga)
}

const initialState = {
    twitter_user: null,
    twitter_loading: false,
    twitter_error: null
}

const main = handleActions({
    [TWITTER_LOGIN_SUCCESS]: (state, {payload: user}) => produce(state, draft => {
        draft.twitter_user = user
        draft.twitter_error = null
    }),
    [TWITTER_LOGIN_FAILURE]: (state, {payload: error}) => produce(state, draft => {
        draft.twitter_user = null
        draft.twitter_error = error
    })
}, initialState)

export default main