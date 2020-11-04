import axios from "axios"

export const checkIsAuthed = () => axios.get("/api/auth/check")

export const getTweetGalleryUser = (twitterId) => axios.get(`/api/auth/user/${twitterId}`)