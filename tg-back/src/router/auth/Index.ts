import express from "express"
import passport from "passport"
import { TweetGalleryUser } from "../../types/TweetGalleryUser"
import TwitterAuthRouter from "./TwitterAuth"

const AuthIndexRouter = express.Router()

passport.serializeUser((user: TweetGalleryUser, done) => {
    done(null, user)
})

passport.deserializeUser((user: TweetGalleryUser, done) => {
    done(null, user)
})

// Setup Auth services.
AuthIndexRouter.use("/auth", TwitterAuthRouter)

AuthIndexRouter.get("/auth/check", (req: express.Request, res: express.Response) => {
    if(req.isAuthenticated()) {
        // Authed.
        const authedUser = (<TweetGalleryUser> req.user)
        authedUser.token = ""
        authedUser.tokenSecret = ""

        res.status(200).send(authedUser)
    } else {
        // Not authed.
        res.sendStatus(401)
    }
})

export default AuthIndexRouter