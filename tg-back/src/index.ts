import express from "express"
import session from "express-session"
import passport from "passport"
import mongoose from "mongoose"
import Logger from "./modules/Logger"
import AuthIndexRouter from "./router/auth/Index"
import GalleryRouter from "./router/api/gallery/Index"
import cookieParser from "cookie-parser"

const app = express()

Logger.info("Initialize server...")

app.use(session({
    secret: "9e44e294-93ad-40f5-9db3-83506a9d22fd",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false
    }
}))

// Setup middlewares.
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// Setup Routers.
app.use("/api", AuthIndexRouter)
app.use("/api", GalleryRouter)

// Startup mongoose
mongoose.connect("mongodb://localhost:27017/tweet-gallery", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    Logger.info("Database connected. Startup http server.")
    app.listen(4000, () => {
        Logger.info("Server is running on 4000 port.")
    })

}).catch(e => {
    Logger.error("Can't connect to mongodb server.")
    Logger.error(e)

})