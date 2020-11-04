import Axios from "axios"

export const Source = {
    GET_LIKES: "https://api.twitter.com/1.1/favorites/list.json",
    GET_TIMELINE: "https://api.twitter.com/1.1/statuses/user_timeline.json",
    GET_PROFILE: "https://api.twitter.com/2/users/by/username/",
    SEARCH_TWEET: "https://api.twitter.com/1.1/search/tweets.json"
}

export const Settings = {
    SIZE_OF_LOAD: 200,              // 좋아요 또는 RT 의 탐색의 갯수 (MAX: 200)
    HASHTAG_BASED_SEARCH_SIZE: 10,  // 해시 태그 탐색 갯수
    HASHTAG_SEARCH_CONST: 2.71828,  // 단일 해시태그 당 검색 갯수
    UPDATE_DELAY: 1440              // 업데이트 주기 (분)
}

export const Calculator = {
    LIKED_SCORE: 1500,              // 좋아요 레이팅 점수
    RT_SCORE: 1200,                 // RT 레이팅 점수
    FOLLOWER_SCORE: 0.3,            // 팔로워 수 (명당) 점수
    TWEET_SCORE: 0.2,               // 업로드 한 트윗 당 점수
    LIKED_PER_PERSON_SCORE: 1,      // 조아요 한개당 점수
    RT_PER_PERSON_SCORE: 0.8,       // RT 한개당 점수
    HASHTAG_DEPEND_SCORE: 100       // 관련된 해시태그가 있는 경우 점수
}

export const client = Axios.create({
    headers: {
        Authorization: "Bearer AAAAAAAAAAAAAAAAAAAAAK5vIwEAAAAAK51KX0ymROrkmQifo6lLvO26xvI%3D6XwoXS7fUViacEXOe2O4v229MXKAznKymRCed0Lh8c1Onft6xd"
    }
})