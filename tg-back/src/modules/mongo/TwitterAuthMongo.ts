import mongoose from "mongoose"
import { ITweetGalleryUser, TweetGalleryUserSchema } from "../../types/TweetGalleryUser"

TweetGalleryUserSchema.statics.findByTwitterId = function(twitterId) {
    return this.findOne({
        twitterId
    })
}

// export mongoose model.
export const TweetGalleryUserModel = mongoose.model<ITweetGalleryUser>("user", TweetGalleryUserSchema)

// export crud helper.
export default class DBTweetGalleryUser {
    constructor() {

    }

    static createUser(newUser: ITweetGalleryUser) : Promise<ITweetGalleryUser> {
        const data = new TweetGalleryUserModel(newUser)
        return data.save()
    }

    static findUserByTwitterId(twitterId: string) : Promise<ITweetGalleryUser> {
        const findPromise = new Promise<ITweetGalleryUser>((resolve, reject) => {
            TweetGalleryUserModel.findOne({twitterId}, (err, user: ITweetGalleryUser) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })

        return findPromise
    }

    static findUserByUsername(username: string) : Promise<ITweetGalleryUser> {
        return new Promise<ITweetGalleryUser>((resolve, reject) => {
            TweetGalleryUserModel.findOne({
                username  
            }, (err, user: ITweetGalleryUser) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
}