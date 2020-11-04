import { createAction, handleActions } from "redux-actions"
import { call, put, takeLatest } from "redux-saga/effects"
import {updateGalleryMeta} from "../libs/apis/GalleryAPI"
import produce from "immer"

const RESET_FORMS = "gallery.settings.form_reset"
const RESET_CODE = "gallery.settings.code_reset"
const UPDATE_FORMS = "gallery.settings.form_update"
const SETTINGS_SAVE = "gallery.settings.save"
const SETTINGS_SAVE_SUCCESS = "gallery.settings.save_SUCCESS"
const SETTINGS_SAVE_FAILURE = "gallery.settings.save_FAILURE"
const SETTINGS_SAVE_LOADING = "gallery.settings.save_LOADING"

export const resetForms = createAction(RESET_FORMS, ({galleryName, galleryContent, galleryLocked}) => ({
    galleryName, galleryContent, galleryLocked
}))

export const resetCode = createAction(RESET_CODE)

export const updateForms = createAction(UPDATE_FORMS, ({name, value}) => ({name, value}))

export const settingSave = createAction(SETTINGS_SAVE, ({username, galleryName, galleryContent, galleryLocked}) => ({
    username, galleryName, galleryContent, galleryLocked
}))

export const settingSaveLoading = createAction(SETTINGS_SAVE_LOADING, loading => loading)

const settingSaveSaga = function*(action) {
    yield put(settingSaveLoading(true))

    try {
        const response = yield call(updateGalleryMeta, action.payload)

        yield put({
            type: SETTINGS_SAVE_SUCCESS,
            payload: response.data,
            meta: response,
            error: false
        })
    } catch(ex) {
        yield put({
            type: SETTINGS_SAVE_FAILURE,
            payload: ex,
            meta: null,
            error: true
        })
    }

    yield put(settingSaveLoading(false))
}

export const gallerySettingSaga = function*() {
    yield takeLatest(SETTINGS_SAVE, settingSaveSaga)
}

const initialState = {
    form: {
        galleryName: "",
        galleryContent: "",
        galleryLocked: false
    },
    loading: false,
    statusCode: 0
}

const gallerySetting = handleActions({
    [RESET_FORMS]: (state, action) => produce(state, draft => {
        draft.form.galleryName = action.payload.galleryName
        draft.form.galleryContent = action.payload.galleryContent
        draft.form.galleryLocked = action.payload.galleryLocked
    }),
    [RESET_CODE]: (state, action) => produce(state, draft => {
        draft.statusCode = 0
    }),
    [UPDATE_FORMS]: (state, action) => produce(state, draft => {
        draft.form[action.payload.name] = action.payload.value
    }),
    [SETTINGS_SAVE_SUCCESS]: (state, action) => produce(state, draft => {
        draft.statusCode = 200
    }),
    [SETTINGS_SAVE_FAILURE]: (state, action) => produce(state, draft => {
        draft.statusCode = action.payload.response.status
    }),
    [SETTINGS_SAVE_LOADING]: (state, action) => produce(state, draft => {
        draft.loading = action.payload
    })
}, initialState)

export default gallerySetting