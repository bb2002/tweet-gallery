import express from "express"
import passport from "passport"
import TwitterStrategy from "passport-twitter"
import {TweetGalleryUser, ITweetGalleryUser} from "../../types/TweetGalleryUser"
import DBTweetGalleryUser from "../../modules/mongo/TwitterAuthMongo"
import AuthConfig from "../../config/AuthConfig"
import DefaultConfig from "../../config/DefaultConfig"
import Logger from "../../modules/Logger"
import {setDefaultWhenEmpty} from "../../libs/Utility"

const TwitterAuthRouter = express.Router()

passport.use(new TwitterStrategy({
    consumerKey: AuthConfig.consumerKey,
    consumerSecret: AuthConfig.consumerSecret,
    callbackURL: "http://localhost:4000/api/auth/twitter/callback"
}, async function(token, tokenSecret, profile, cb) {

    const newUser = new TweetGalleryUser()
    newUser.twitterId       = profile.id
    newUser.username        = setDefaultWhenEmpty(profile.username, DefaultConfig.DEFAULT_NAME)
    newUser.displayName     = setDefaultWhenEmpty(profile.displayName, DefaultConfig.DEFAULT_NAME)
    newUser.profileImage    = setDefaultWhenEmpty(profile._json.profile_image_url.replace("normal", "400x400"), DefaultConfig.DEFAULT_IMAGE)
    newUser.bannerImage     = setDefaultWhenEmpty(profile._json.profile_banner_url, DefaultConfig.DEFAULT_IMAGE)
    newUser.token           = token
    newUser.tokenSecret     = tokenSecret

    try {
        const user = await DBTweetGalleryUser.findUserByTwitterId(newUser.twitterId)

        if(!user) {
            // 사용자가 없는 경우
            let userByMongo = <ITweetGalleryUser>({
                twitterId: newUser.twitterId,
                username: newUser.username,
                displayName: newUser.displayName,
                profileImage: newUser.profileImage,
                bannerImage: newUser.bannerImage
            })
            await DBTweetGalleryUser.createUser(userByMongo)
        }

        cb(null, newUser)
    } catch(ex) {
        cb(ex, null)
    }
}))

TwitterAuthRouter.get("/twitter", passport.authenticate("twitter"))
TwitterAuthRouter.get("/twitter/callback", passport.authenticate("twitter", {
    failureRedirect: (DefaultConfig.ERROR_CALLBACK + "?code=500")
}), (req: express.Request, res: express.Response) => {
    res.redirect("http://localhost:3000")
})

TwitterAuthRouter.get("/user/:twitterId", (req: express.Request, res: express.Response) => {
    const twitterId = req.params.twitterId

    if(!twitterId) {
        res.sendStatus(401)
        return;
    }

    DBTweetGalleryUser.findUserByTwitterId(twitterId)
        .then((value: ITweetGalleryUser) => {
            if(value) {
                res.send(value)
            } else {
                res.sendStatus(404)
            }
        })
        .catch(ex => {
            Logger.error(ex)
            res.send(500)
        })
})


export default TwitterAuthRouter