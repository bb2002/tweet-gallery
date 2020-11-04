import mongoose from "mongoose"

/**
 * @Date 10.18 2020
 * Passport 에서 직렬화, 역직렬화 과정에서 사용될 구조체
 */
export class TweetGalleryUser {
    twitterId: string = ""
    username: string = ""
    displayName: string = "GUEST"
    profileImage: string = ""
    bannerImage: string = ""
    token: string = ""
    tokenSecret: string = ""
}

/**
 * @Date 10.19 2020
 * Mongoose 연동에서 타입 정의
 */
export interface ITweetGalleryUser extends mongoose.Document {
    twitterId: string
    username: string
    displayName: string
    profileImage: string
    bannerImage: string
}

/**
 * @Date 10.19 2020
 * Mongoose 의 스키마
 */
export const TweetGalleryUserSchema = new mongoose.Schema({
    twitterId:      {type: String, required: true},
    username:       {type: String, required: true},
    displayName:    {type: String, required: true},
    profileImage:   {type: String, required: true},
    bannerImage:    {type: String, required: true}
})