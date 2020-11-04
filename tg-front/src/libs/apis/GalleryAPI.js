import axios from "axios"

// 새로운 갤러리를 만듭니다.
export const createGallery = ({galleryName, galleryContent, galleryLocked}) => axios.post("/api/gallery", {
    galleryName,
    galleryContent,
    galleryLocked
})

// 만든 갤러리를 받아옵니다.
export const getGallery = (username) => axios.get(`/api/gallery/@${username}`)

// 갤러리의 메타 정보를 업데이트 합니다.
export const updateGalleryMeta = ({username, galleryName, galleryContent, galleryLocked}) => axios.patch(`/api/gallery/@${username}`, {
    galleryName, galleryContent, galleryLocked
})

// 갤러리의 존재여부를 확인합니다.
export const checkGallery = () => axios.get("/api/gallery/validate")

// 갤러리를 업데이트 합니다.
export const updateGalleryData = (twitterId) => axios.patch("/api/gallery/update", {
    twitterId
})
