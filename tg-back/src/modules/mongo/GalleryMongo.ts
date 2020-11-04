import mongoose from "mongoose"
import { ITweetGallery, TweetGallery, TweetGallerySchema } from "../../types/GalleryType"
import { ITweetGalleryUser, TweetGalleryUser } from "../../types/TweetGalleryUser"
import { TweetItem } from "../../types/GalleryType"
import DBTweetGalleryUser from "./TwitterAuthMongo"
const moment = require('moment')

export const TweetGalleryModel = mongoose.model<ITweetGallery>("gallery", TweetGallerySchema)

export default class DBTweetGallery {
    constructor() {

    }

    /**
     * @Date 10.31 2020
     * 새로운 갤러리를 만듭니다.
     * @param newGallery 생성할 갤러리 정보
     */
    static createGallery(newGallery: TweetGallery) : Promise<ITweetGallery> {
        const gallery = <ITweetGallery>({
            ownerTwitterId: newGallery.ownerTwitterId,
            galleryName: newGallery.galleryName,
            galleryContent: newGallery.galleryContent,
            galleryLocked: newGallery.galleryLocked,
            galleryItems: <TweetItem[]>[],
            visitCount: 0,
            createdAt: newGallery.createdAt
        })

        const query = new TweetGalleryModel(gallery)
        return query.save()
    }

    /**
     * @Date 10.31 2020
     * twitterId 를 기반으로 갤러리를 찾습니다.
     * @param owner twitterId 가 포함된 트윗 갤러리유저 객체
     */
    static findGalleryByOwner(owner: TweetGalleryUser) : Promise<ITweetGallery> {
        const findPromise = new Promise<ITweetGallery>((resolve, reject) => {
            TweetGalleryModel.findOne({
                ownerTwitterId: owner.twitterId
            }, (err, gallery: ITweetGallery) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(gallery)
                }
            })
        })

        return findPromise
    }

    /**
     * @Date 10.31 2020
     * username 을 기반으로 갤러리를 찾습니다.
     * @param username 유저 이름
     */
    static findGalleryByUsername(username: string) : Promise<ITweetGallery> {
        return new Promise<ITweetGallery>((resolve, reject) => {
            DBTweetGalleryUser.findUserByUsername(username)
                .then((value: ITweetGalleryUser) => {
                    if(value) {
                        const twitterId = value.twitterId
                        const user = new TweetGalleryUser()
                        user.twitterId = twitterId
    
                        this.findGalleryByOwner(user)
                            .then((value) => resolve(value))
                            .catch(ex => reject(ex))
                    } else {
                        reject(null)
                    }
                    
                })
                .catch(ex => {
                    reject(ex)
                })
        })
    }

    static resetGalleryItem(twitterId: string, newItems: TweetItem[]) : Promise<ITweetGallery> {
        const resetPromise = new Promise<ITweetGallery>((resolve, reject) => {
            TweetGalleryModel.findOne({
                ownerTwitterId: twitterId
            }, (err, gallery: ITweetGallery) => {
                if(err) {
                    reject(err)
                } else {
                    // 레이팅에 따라 정렬한다.
                    newItems.sort((a: TweetItem, b: TweetItem) => b.rating - a.rating)

                    gallery.galleryItems = newItems
                    gallery.lastUpdate = moment().format("YYYY-MM-DD HH:mm:ss")
                    gallery.save()
                        .then((updatedGallery: ITweetGallery) => {
                            resolve(updatedGallery)
                        })
                        .catch((ex) => {
                            reject(ex)
                        })
                }
            })
        })

        return resetPromise
    }
}