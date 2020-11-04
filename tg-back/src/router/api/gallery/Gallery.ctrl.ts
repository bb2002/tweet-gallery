import express from "express"
import { TweetGalleryUser } from "../../../types/TweetGalleryUser"
import DBTweetGallery from "../../../modules/mongo/GalleryMongo"
import { ITweetGallery, TweetGallery, TweetItem, TwitterUser } from "../../../types/GalleryType"
import Logger from "../../../modules/Logger"
import { TweetGalleryJoiSchema } from "../../../config/HapiJoi"
import QueryString from "qs"
import {Source, Settings, client, Calculator} from "../../../config/TwitterAPIConfig"
import clamp from "clamp"
const moment = require("moment")


/**
 * @Date 11.01 2020
 * 새로운 갤러리를 만듭니다.
 */
export const createGallery = (req: express.Request, res: express.Response) => {
    const user = <TweetGalleryUser>(req.user)

    const {error, value} = TweetGalleryJoiSchema.validate(req.body)
    if(error) {
        console.log(error)
        res.sendStatus(400)
        return
    } 

    // 새로운 갤러리 정의
    const newTweetGallery = new TweetGallery()
    newTweetGallery.ownerTwitterId = user.twitterId
    newTweetGallery.galleryName = value.galleryName
    newTweetGallery.galleryContent = value.galleryContent
    newTweetGallery.galleryLocked = value.galleryLocked
    newTweetGallery.lastUpdate = ""
    newTweetGallery.createdAt = moment().format("YYYY-MM-DD HH:mm:ss")

    // 사용자가 이미 갤러리를 소유하고 있는지 확인.
    DBTweetGallery.findGalleryByOwner(user)
        .then((gallery: ITweetGallery) => {
            if(gallery == null) {
                DBTweetGallery.createGallery(newTweetGallery)
                    .then(() => {
                        // 갤러리 생성 성공.
                        res.status(200).send(newTweetGallery)
                    })
                    .catch((ex) => {
                        res.sendStatus(500)
                        Logger.error(ex)
            console.error(ex)

                    })
            } else {
                // 이미 갤러리가 있음.
                newTweetGallery.ownerTwitterId = gallery.ownerTwitterId
                newTweetGallery.galleryName = gallery.galleryName
                newTweetGallery.galleryContent = gallery.galleryContent
                newTweetGallery.galleryLocked = gallery.galleryLocked
                res.status(200).send(newTweetGallery)
            }
        })
        .catch((ex) => {
            res.sendStatus(500)
            Logger.error(ex)
        })
}

/**
 * @Date 11.01 2020
 * 로그인 한 사용자가 갤러리가 있는지 확인합니다.
 */
export const checkGallery = (req: express.Request, res: express.Response) => {
    const user = <TweetGalleryUser>(req.user)

    DBTweetGallery.findGalleryByOwner(user)
        .then((gallery: ITweetGallery) => {
            if(gallery == null) {
                res.sendStatus(404)
            } else {
                res.sendStatus(200)
            }
        })
        .catch((ex) => {
            res.sendStatus(500)
            Logger.error(ex)
        })
}

/**
 * @Date 11.01 2020
 * 유저네임 기반으로 갤러리를 가져옵니다.
 */
export const getGallery = (req: express.Request, res: express.Response) => {
    const username = req.params.username

    if(!username) {
        res.sendStatus(400)
        return;
    }

    DBTweetGallery.findGalleryByUsername(username)
        .then((value: ITweetGallery) => {
            if(value) {
                const gallery = <TweetGallery>(value)

                // 비공개 갤러리 처리
                const user = <TweetGalleryUser>req.user
                let doLock = false
                if(user) {
                    if(user.username === username) {
                        // 갤러리 오너의 경우 잠그지 않음.
                        doLock = false
                    } else {
                        doLock = true
                    }
                } else {
                    if(gallery.galleryLocked) {
                        doLock = true
                    } else {
                        doLock = false
                    }
                }

                if(doLock) {
                    gallery.galleryItems = []
                    gallery.galleryName = "비공개 갤러리 입니다."
                    gallery.galleryContent = "비공개 갤러리 입니다."
                }

                if(req.cookies[value._id] === undefined) {
                    res.cookie(value._id, moment().format("YYYY-MM-DD HH:mm:ss"))

                    // 조회수를 증가한다.
                    value.visitCount++
                    value.save()
                }
                

                res.send(gallery)
            } else {
                res.sendStatus(404)
            }
        })
        .catch(ex => {
            if(ex === null) {
                // 사용자 또는 갤러리를 찾을 수 없는 경우.
                res.sendStatus(404)
            } else {
                // 내부 서버 오류
                console.error(ex)
                Logger.error(ex)
                res.sendStatus(500)
            } 
        })

    
}


/**
 * @Date 10.27 2020
 * 해당 사용자의 갤러리 데이터를 트위터 정보에 기반하여 업데이트 합니다.
 */
export const updateGallery = (req: express.Request, res: express.Response) => {
    const twitterId = req.body.twitterId

    // 이 사용자가 업뎃을 해야할지 검토한다.
    const owner = new TweetGalleryUser()
    owner.twitterId = twitterId

    DBTweetGallery.findGalleryByOwner(owner)
        .then((value: ITweetGallery) => {
            if(!value) {
                // 해당 갤러리가 없는 경우.
                res.sendStatus(404)
                return;
            }

            // 갤러리를 업데이트 해야하는지 검토한다.
            const now = moment()
            const lastUpdate = moment(value.lastUpdate)

            if(value.lastUpdate === "" || moment.duration(now.diff(lastUpdate)).asMinutes() > Settings.UPDATE_DELAY) {
                // 검토할 트윗을 탐색한다.
                exportExploreingTweets(twitterId)
                .then((value: TweetItem[]) => {
                    // 트윗을 계산한다.
                    ratingTweets(value)

                    // DB 에 값을 갱신한다.
                    DBTweetGallery.resetGalleryItem(twitterId, value)
                        .then((value: ITweetGallery) => {
                            const item = <TweetGallery>value
                            res.status(200).send(item)
                        })
                        .catch(ex => {
                            Logger.error(ex)
                            res.sendStatus(500)
                        })
                })
                .catch((ex) => {
                    console.error(ex)
                    Logger.error(ex)
                    res.sendStatus(500)
                    
                })
            } else {
                // 이미 업데이트 된 경우
                res.sendStatus(204)
            }
        })
        .catch(ex => {
            console.error(ex)
            Logger.error(ex)
            res.sendStatus(500)
        })
}

export const updateGalleryMeta = (req: express.Request, res: express.Response) => {
    const user = <TweetGalleryUser>req.user
    const {galleryName, galleryContent, galleryLocked} = req.body
    const targetUsername = req.params.username

    // 입력 값 검증
    const {error, value} = TweetGalleryJoiSchema.validate(req.body)
    if(error) {
        console.log(error)
        res.sendStatus(400)
        return
    } 

    // 로그인되지 않거나, 타겟 사용자가 없는 경우
    if(!user || targetUsername === undefined) {
        res.sendStatus(400)
        return
    }

    // 로그인된 사용자와 타겟이 다른 경우
    if(targetUsername !== user.username) {
        res.sendStatus(401)
        return
    }

    // 저장
    DBTweetGallery.findGalleryByOwner(user)
        .then((value: ITweetGallery) => {
            value.galleryName = galleryName
            value.galleryContent = galleryContent
            value.galleryLocked = galleryLocked
            value.save()
            res.sendStatus(204)
        })
        .catch(ex => {
            Logger.error(ex)
            console.error(ex)
            res.sendStatus(500)
        })
}

/**
 * 해당 사용자의 취미를 기반으로, 조사할 트윗들을 불러옵니다.
 * 1. 좋아요를 누른 경우
 * 2. RT 를 누른경우
 * 3. 좋아요 || RT 를 누른 트윗의 해시태그가 포함된 타임라인 내 트윗.
 * @param twitterId 조사할 사용자의 트위터 ID
 */
interface HashtagItem {
    text: string,
    num: number
}

function exportExploreingTweets(twitterId: string) : Promise<TweetItem[]> {

    const promise = new Promise<TweetItem[]>(async (resolve, reject) => {
        const query = QueryString.stringify({
            user_id: twitterId,
            count: Settings.SIZE_OF_LOAD
        })

        const exploredTweets: TweetItem[] = []

        try {
            {
                // 좋아요 목록을 가져온다.
                const response = await client.get(`${Source.GET_LIKES}?${query}`)
                if(response.status !== 200) throw("Internal server error of Twitter API.")

                const data = <Array<any>>response.data

                for(let i = 0; i < data.length; ++i) {
                    const tweetItem = anyToTweet(data[i], twitterId)
                    if(tweetItem.media.length !== 0) {
                        exploredTweets.push(tweetItem)
                    }
                }
            }

            {
                // RT 목록을 가져온다.
                const response = await client.get(`${Source.GET_TIMELINE}?${query}`)
                if(response.status !== 200) throw("Internal server error of Twitter API.")

                const data = <Array<any>>response.data

                for(let i = 0; i < data.length; ++i) {
                    // RT 한 아이템인지 확인.
                    if(data[i].retweeted_status !== undefined) {
                        const tweetItem = anyToTweet(data[i], twitterId)
                        if(tweetItem.media.length !== 0) {
                            exploredTweets.push(tweetItem)
                            exploredTweets.push(tweetItem)
                        }
                    }
                }
            }

            {
                const hashtags = {}

                // 해시태그 계산
                for(let i = 0; i < exploredTweets.length; ++i) {
                    const item = exploredTweets[i]
                    if(item.hashtags.length !== 0) {
                        for(let j = 0; j < item.hashtags.length; ++j) {
                            if(hashtags[item.hashtags[j]] === undefined) {
                                hashtags[item.hashtags[j]] = 1
                            } else {
                                ++hashtags[item.hashtags[j]]
                            }
                        }
                    }
                }

                // 해시태그 정렬
                const keys = Object.keys(hashtags)
                const sortedHashtags = new Array<HashtagItem>()
                for(let i = 0; i < keys.length; ++i) {
                    sortedHashtags.push(<HashtagItem>{
                        text: keys[i],
                        num: hashtags[keys[i]]
                    })
                }
                sortedHashtags.sort((a: HashtagItem, b: HashtagItem) => (b.num - a.num))

                
                // 해시태그 검색 및 트윗 찾기
                const size = clamp(sortedHashtags.length, 0, Settings.HASHTAG_BASED_SEARCH_SIZE)

                for(let i = 0; i < size; ++i) {
                    const count = clamp(Math.floor(sortedHashtags[i].num * Settings.HASHTAG_SEARCH_CONST), 0, 100)
                    const query = QueryString.stringify({
                        q: `#${sortedHashtags[i].text}`,
                        result_type: "mixed",
                        count
                    })

                    const response = await client.get(`${Source.SEARCH_TWEET}?${query}`)
                    if(response.status !== 200) throw("Internal server error of Twitter API.")

                    const data = <Array<any>>response.data.statuses

                    for(let j = 0; j < data.length; ++j) {
                        const tweetItem = anyToTweet(data[j], twitterId)
                        if(tweetItem.media.length !== 0) {

                            // 해당 해시태그에 대한 레이팅 추가 (핵)
                            tweetItem.rating += sortedHashtags[i].num * Calculator.HASHTAG_DEPEND_SCORE
                            // 해당 해시태그에 대한 레이팅 추가 (핵 끝)

                            exploredTweets.push(tweetItem)
                        }
                    }
                }
            }

            // 최종적으로 중복되는 트윗은 제거한다.
            const output: TweetItem[] = []
            for(let i = 0; i < exploredTweets.length; ++i) {
                let isExist = false

                for(let j = 0; j < output.length; j ++) {
                    if(output[j].id === exploredTweets[i].id) {
                        isExist = true
                    }
                }

                if(!isExist) {
                    output.push(exploredTweets[i])
                }
            }

            resolve(output)
        } catch(ex) {
            Logger.error(ex)
            reject(ex)
        }
    })

    return promise
}

/**
 * 트윗 배열에 입력된 트윗들에 레이팅을 측정합니다.
 * 1. 좋아요 OR RT 를 하여 사용자가 호감을 표시했는가?
 * 2. 해당 글을 올린자가 영향력이 있는가? (팔로워 수, 올린 트윗 갯수로 구분)
 * 3. 해당 글이 인기가 많은가? (좋아요와 RT 로 구분)
 * 
 */
function ratingTweets(tweetItems: TweetItem[]) {
    for(let i = 0; i < tweetItems.length; ++i){
        let totalRating = 0
        const item = tweetItems[i]

        if(item.isLiked) {
            // 좋아요 점수 부여
            totalRating += Calculator.LIKED_SCORE
        }

        if(item.isReTweeted) {
            // RT 점수 부여
            totalRating += Calculator.RT_SCORE
        }

        // 팔로워 수 당 점수 부여
        totalRating += item.owner.followers * Calculator.FOLLOWER_SCORE

        // 업로드 한 트윗 당 점수부여
        totalRating += item.owner.tweetCount * Calculator.TWEET_SCORE

        // 해당 글의 좋아요 당 점수부여
        totalRating += item.likedCount * Calculator.LIKED_PER_PERSON_SCORE

        // 해당 글의 RT 당 점수 부여
        totalRating += item.retweetedCount *  Calculator.RT_PER_PERSON_SCORE

        item.rating = totalRating
    }
}

function anyToTwitterUser(tUser: any) : TwitterUser {
    const user = new TwitterUser()
    user.twitterId = tUser.id_str
    user.username = tUser.screen_name
    user.displayName = tUser.name
    user.profileImage = tUser.profile_image_url.replace("normal", "400x400")
    user.friends = tUser.friends_count
    user.followers = tUser.followers_count
    user.bannerImage = tUser.profile_banner_url
    user.tweetCount = tUser.statuses_count

    return user
}

function anyToTweet(item: any, twitterId: string) : TweetItem {
    const tmp = new TweetItem()

    tmp.created_at = item.created_at
    tmp.id = item.id_str
    tmp.isLiked = true
    tmp.isReTweeted = item.retweeted_status !== undefined

    if(tmp.isReTweeted) {
        // item 을 rt 한 트윗으로 변경
        item = item.retweeted_status

        // RT 여부, 내 트윗인지 여부 정하기
        tmp.isReTweeted = true
        tmp.isMyTweet = false
    } else {
        tmp.isReTweeted = false
        tmp.isMyTweet = item.user.id_str === twitterId
    }

    // 트윗의 리트윗 횟수, 조아요 횟수 계산
    tmp.retweetedCount = item.retweet_count
    tmp.likedCount = item.favorite_count
    tmp.owner = anyToTwitterUser(item.user)
    tmp.text = item.text

    // 확장 엔티티 값 정의
    if(item.entities !== undefined) {
        item.ent = item.entities
    }

    if(item.extended_entities !== undefined) {
        item.ent = item.extended_entities
    }
    
    // 해시 태그 가져오기
    try {
        const hashtags = <Array<any>>item.ent.hashtags
        for(let j = 0; j < hashtags.length; ++j) {
            tmp.hashtags.push(hashtags[j].text)
        }
    } catch(ex) {
        tmp.hashtags = []
    }

    // media 가져오기
    try {
        const medias = <Array<any>>item.ent.media
        for(let j = 0; j < medias.length; ++j) {
            if(medias[j].type === "photo") {
                // 사진만 추가합니다. 업데이트에서 동영상도 가능할지도...
                tmp.media.push(medias[j].media_url)
            }
        }
    } catch(ex) {
        tmp.media = []
    }

    
    return tmp
}