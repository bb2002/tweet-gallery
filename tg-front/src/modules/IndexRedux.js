import { combineReducers } from "redux"
import { all } from "redux-saga/effects"
import main, { mainSaga } from "./MainRedux"
import createGallery from "./CreateGalleryRedux"
import myGallery, { myGallerySaga } from "./MyGalleryRedux"
import gallerySetting, {gallerySettingSaga} from "./GallerySettingRedux"

export function* rootSaga() {
    yield all([
        mainSaga(),
        myGallerySaga(),
        gallerySettingSaga()
    ])
}

const rootReducer = combineReducers({
    main,
    createGallery,
    myGallery,
    gallerySetting
})

export default rootReducer