import express from "express"
import * as GalleryCtrl from "./Gallery.ctrl"

const GalleryRouter = express.Router()

function checkAuth(req, res, next) {
    if(req.isAuthenticated()) {
        next()
    } else {
        //next()
        res.sendStatus(401)
    }
}

GalleryRouter.post("/gallery", checkAuth, GalleryCtrl.createGallery)
GalleryRouter.get("/gallery/@:username", GalleryCtrl.getGallery)
GalleryRouter.patch("/gallery/@:username", checkAuth, GalleryCtrl.updateGalleryMeta)
GalleryRouter.get("/gallery/validate", checkAuth, GalleryCtrl.checkGallery)
GalleryRouter.patch("/gallery/update", GalleryCtrl.updateGallery)

export default GalleryRouter