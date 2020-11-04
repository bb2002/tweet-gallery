import { createAction, handleActions } from "redux-actions"

const CREATE_GALLERY_FORM_UPDATE = "creategallery.from_update"
const CREATE_LOADING = "creategallery.loading"
const CREATE_FORM_RESET = "creategallery.reset"
const CREATE_ERROR = "creategallery.error"

export const createGalleryFormUpdate = createAction(CREATE_GALLERY_FORM_UPDATE, ({key, value}) => ({key, value}))
export const createGalleryLoading = createAction(CREATE_LOADING, loading => loading)
export const createGalleryFormReset = createAction(CREATE_FORM_RESET, ({name, content}) => ({name, content}))
export const createGalleryError = createAction(CREATE_ERROR, message => message)

const initialState = {
    gallery_name: "",
    gallery_content: "",
    gallery_locked: false,
    create_loading: false,
    create_error: null
}

const createGallery = handleActions({
    [CREATE_GALLERY_FORM_UPDATE]: (state, action) => ({
        ...state,
        [action.payload.key]: action.payload.value
    }),
    [CREATE_LOADING]: (state, action) => ({
        ...state,
        create_loading: action.payload
    }),
    [CREATE_FORM_RESET]: (state, action) => ({
        ...initialState,
        gallery_name: action.payload.name ? action.payload.name.slice(0, 15) : null,
        gallery_content: action.payload.content ? action.payload.content.slice(0, 100) : null
    }),
    [CREATE_ERROR]: (state, {payload: create_error}) => ({
        ...state,
        create_error
    })
}, initialState)

export default createGallery