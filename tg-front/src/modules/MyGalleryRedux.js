import produce from "immer"
import { createAction, handleActions } from "redux-actions"
import { call, put, takeLatest } from "redux-saga/effects"
import {getGallery, updateGalleryData} from '../libs/apis/GalleryAPI'

const LOAD_GALLERY = "mygallery.load"         // 갤러리의 메타 정보를 로드 합니다.
const LOAD_GALLERY_SUCCESS = "mygallery.load_SUCCESS"
const LOAD_GALLERY_FAILURE = "mygallery.load_FAILURE"
const LOAD_GALLERY_LOADING = "mygallery.load_LOADING"

const UPDATE_GALLERY = "mygallery.update"     // 갤러리 데이터를 업데이트 합니다.
const UPDATE_GALLERY_SUCCESS = "mygallery.update_SUCCESS"
const UPDATE_GALLERY_FAILURE = "mygallery.update_FAILURE"
const UPDATE_GALLERY_LOADING = "mygallery.update_LOADING"

const TAP_CHANGE = "mygallery.tap"

export const loadGallery = createAction(LOAD_GALLERY, (username) => (username))
export const loadGalleryLoading = createAction(LOAD_GALLERY_LOADING, (loading) => (loading))
export const updateGallery = createAction(UPDATE_GALLERY, (twitterId) => (twitterId))
export const updateGalleryLoading = createAction(UPDATE_GALLERY_LOADING, (loading) => (loading))
export const tapChange = createAction(TAP_CHANGE, (newtap) => (newtap))

const loadGallerySaga = function*(action) {
    yield put(loadGalleryLoading(true))

    try {
        const response = yield call(getGallery, action.payload)

        yield put({
            type: LOAD_GALLERY_SUCCESS,
            payload: response.data,
            meta: response,
            error: false
        })
    } catch(ex) {
        yield put({
            type: LOAD_GALLERY_FAILURE,
            payload: ex,
            meta: null,
            error: true
        })
    } finally {
        yield put(loadGalleryLoading(false))
    }
}

const updateGallerySaga = function*(action) {
    yield put(updateGalleryLoading(true))

    try {
        const response = yield call(updateGalleryData, action.payload)

        yield put({
            type: UPDATE_GALLERY_SUCCESS,
            payload: response.data,
            meta: response,
            error: false
        })
    } catch(ex) {
        yield put({
            type: UPDATE_GALLERY_FAILURE,
            payload: ex,
            meta: null,
            error: true
        })
    }

    yield put(updateGalleryLoading(false))
}

export function* myGallerySaga() {
    yield takeLatest(LOAD_GALLERY, loadGallerySaga)
    yield takeLatest(UPDATE_GALLERY, updateGallerySaga)
}

const initalState = {
    gallery: {},
    galleryLoading: false,
    error: 200,
    galleryUpdateCode: 0,
    galleryUpdateLoading: false,
    selectedTap: "gallery"
}

const myGallery = handleActions({
    [LOAD_GALLERY_SUCCESS]: (state, action) => produce(state, draft => {
        draft.gallery = action.payload
        draft.error = 200
    }),
    [LOAD_GALLERY_FAILURE]: (state, action) => produce(state, draft => {
        draft.gallery = null
        draft.error = action.payload.response.status
    }),
    [LOAD_GALLERY_LOADING]: (state, action) => produce(state, draft => {
        draft.galleryLoading = action.payload
    }),
    [UPDATE_GALLERY_SUCCESS]: (state, action) => produce(state, draft => {
        draft.galleryUpdateCode = 200
    }),
    [UPDATE_GALLERY_FAILURE]: (state, action) => produce(state, draft => {
        draft.galleryUpdateCode = action.payload.response.status
    }),
    [UPDATE_GALLERY_LOADING]: (state, action) => produce(state, draft => {
        draft.galleryUpdateLoading = action.payload
    }),
    [TAP_CHANGE]: (state, action) => produce(state, draft => {
        draft.selectedTap = action.payload
    })
}, initalState)

export default myGallery