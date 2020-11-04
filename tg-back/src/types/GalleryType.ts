import { number } from "joi"
import mongoose from "mongoose"

export class TwitterUser {
    twitterId: string = ""
    displayName: string = ""    // 트위터에 표시되는 이름
    username: string = ""       // @[username] 에 사용되는 이름
    followers: number = 0       // 이 유저를 팔로우 하는 사람 수
    friends: number = 0         // 이 유저가 팔로우 하는 사람 수
    tweetCount: number = 0      // 업로드 한 트윗 갯수
    profileImage: string = ""   // 프로필 사진 URL
    bannerImage: string = ""    // 배너 이미지
}

export class TweetItem {
    id: string = ""             // 트윗 아이디
    created_at: string = ""     // 트윗 쓴 날짜
    text: string = ""           // 트윗 텍스트
    media: string[] = []        // 미디어
    owner: TwitterUser = new TwitterUser()  // 트윗 쓴 사람
    isReTweeted: boolean = false    // RT 했는가?
    isLiked: boolean = false        // 좋아요 했는가?
    isMyTweet: boolean = false      // 내 트윗인가?
    likedCount: number = 0          // 이 트윗의 좋아요 횟수
    retweetedCount: number = 0      // 이 트윗의 RT 횟수
    hashtags: string[] = []         // 이 트윗에 적용된 해시태그
    rating: number = 0              // 선호 레이팅
}

export class TweetGallery {
    ownerTwitterId: string = ""
    galleryName: string = ""
    galleryContent: string = ""
    galleryLocked: boolean = false
    galleryItems: TweetItem[] = []
    lastUpdate: string = ""
    visitCount: number = 0
    createdAt: string = "1970-01-01 00:00:00"
}

export interface ITweetGallery extends mongoose.Document {
    ownerTwitterId: string
    galleryName: string
    galleryContent: string
    galleryLocked: boolean
    galleryItems: TweetItem[]
    lastUpdate: string
    visitCount: number
    createdAt: string
}

export const TweetGallerySchema = new mongoose.Schema({
    ownerTwitterId:     {type: String, required: true},
    galleryName:        {type: String, required: true},
    galleryContent:     {type: String, required: true},
    galleryLocked:      {type: Boolean, required: true},
    galleryItems:       {type: Array, required: true},
    lastUpdate:         {type: String, required: false, default: ""},
    visitCount:         {type: Number, required: true, default: 0},
    createdAt:          {type: String, required: true, default: ""}
})