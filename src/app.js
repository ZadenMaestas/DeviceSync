const express = require('express')
const app = express()
const cookieSession = require('cookie-session');
const {Level} = require('level')
const db = new Level('users', {valueEncoding: 'json'}) // Connect to database upon server start
const accountManager = require("./lib/userManager");
const {viewEngine} = require("./lib/templater"); // Custom view engine that allowed a quite slick SPA-like HTML codebase minification

/* Non-production environment code
 * Live Reload Setup, only necessary on development environment
 * DB debugging
 * Comment this out on production versions
//const {readDB} = require("./lib/debug");
//readDB(db)

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
app.use(connectLiveReload()); // Middleware for livereload
 */

// Required middleware
app.use(express.urlencoded({extended: true, limit: '1mb'}))
app.use(cookieSession({
    name: 'session',
    keys: ["loginSession"],

    // Cookie Options
    maxAge: 30 * 24 * 60 * 60 * 1000 // 1 Month
}))
app.use(express.static('public')) // File serving middleware, routed to src/public

app.engine('dstemplate', viewEngine)
app.set('views', './pages') // specify the views directory
app.set('view engine', 'dstemplate') // register the template engine


const PORT = 3000

////////////////////////////////////////////////////////////////
///// Basic Application Routes /////////////////////////////////
////////////////////////////////////////////////////////////////


// Index Routing
app.get('/', (req, res) => {
    // If logged in send to logged in page, otherwise home page
    if (req.session["loginSession"]) {
        res.render('signedInHome')
    } else {
        res.render('signedOutHome')
    }
})


// /account routing logic
app.get('/account', (req, res) => {
    // If logged in send to my account page, otherwise send to signup
    if (req.session["loginSession"]) {
        res.render('myAccount')
    } else {
        res.render('signup')
    }
})

////////////////////////////////////////////////////////////////
///// Account Management Endpoints /////////////////////////////
////////////////////////////////////////////////////////////////

app.route("/account/signup")
    .get(async (req, res) => {
        if (req.session["loginSession"]) {
            res.render('myAccount')
        } else {
            res.render('signup')
        }
    })
    .post(async (req, res) => {
        let postedData = req.body
        if (postedData.username && postedData.password) {
            let serverResponse = await accountManager.createUser(db, postedData.username, postedData.password)
            if (serverResponse === "User has been created successfully") {
                req.session["loginSession"] = [postedData.username, postedData.password]
                res.send({"Success": serverResponse})
            } else {
                res.send({"Error": serverResponse})
            }
        } else {
            res.response.send({"Error": "Please include both a username and password"})
        }
    })

app.route("/account/signin")
    .get(async (req, res) => {
        if (req.session["loginSession"]) {
            res.render('myAccount')
        } else {
            res.render('signin')
        }
    })
    .post(async (req, res) => {
        let postedData = req.body
        if (postedData.username && postedData.password) {
            let serverResponse = await accountManager.loginUser(db, postedData.username, postedData.password)
            if (serverResponse === "Successfully Signed In") {
                req.session["loginSession"] = [postedData.username, postedData.password]
                res.send({"Success": serverResponse})
            } else {
                res.send({"Error": serverResponse})
            }
        } else {
            res.send({"Error": "Please include both a username and password"})
        }
    })

app.get('/account/delete', async (req, res) => {
    if (req.session["loginSession"]) {
        const username = req.session["loginSession"][0]
        const password = req.session["loginSession"][1]
        let serverResponse = await accountManager.deleteUser(db, username, password)
        if (serverResponse.search("Successfully Deleted") !== -1) {
            req.session = null
            res.redirect('/')
        } else {
            res.status(406).send("Invalid user details")
        }
    } else {
        res.redirect('/account/signin')
    }
})

// Note Management
app.get('/account/newNote/:title/:content', async (req, res) => {
    if (req.session["loginSession"]) {
        const parametersIncluded = req.params.title && req.params.content
        if (parametersIncluded) {
            const username = req.session["loginSession"][0]
            const password = req.session["loginSession"][1]
            const note = {Title: req.params.title, Content: req.params.content}
            let serverResponse = await accountManager.newNote(db, note, username, password)
            res.send(serverResponse)
        } else if (!parametersIncluded) {
            res.send({"Error": "Please include both a title for your note and content"})
        }

    } else {
        res.redirect("/account/signin")
    }
})

app.get('/account/editNote/:title/:content', async (req, res) => {
    if (req.session["loginSession"]) {
        const parametersIncluded = req.params.title && req.params.content
        if (parametersIncluded) {
            const username = req.session["loginSession"][0]
            const password = req.session["loginSession"][1]
            const note = {Title: req.params.title, Content: req.params.content}
            let serverResponse = await accountManager.editNote(db, note, username, password)
            res.send(serverResponse)
        } else if (!parametersIncluded) {
            res.send({"Error": "Note title needs to be specified"})
        }

    } else {
        res.redirect("/account/signin")
    }
})

app.get('/account/deleteNote/:title', async (req, res) => {
    if (req.session["loginSession"]) {
        const parametersIncluded = req.params.title
        if (parametersIncluded) {
            const username = req.session["loginSession"][0]
            const password = req.session["loginSession"][1]
            const note = {Title: req.params.title, Content: req.params.content}
            let serverResponse = await accountManager.deleteNote(db, note, username, password)
            res.send(serverResponse)
        } else if (!parametersIncluded) {
            res.send({"Error": "Note title needs to be specified"})
        }

    } else {
        res.redirect("/account/signin")
    }
})

app.get('/account/getNotes', async (req, res) => {
    if (req.session["loginSession"]) {
        const username = req.session["loginSession"][0]
        const password = req.session["loginSession"][1]
        let serverResponse = await accountManager.getNotes(db, username, password)
        res.send(serverResponse)
    } else {
        res.redirect("/account/signin")
    }
})

app.get("/logout", (req, res) => {
    req.session = null
    res.redirect('/')
})

////////////////////////////////////////////////////////////////
///// Analytics Endpoints //////////////////////////////////////
////////////////////////////////////////////////////////////////

/**
 * /analytics/hit allows quite basic tracking of unique page hits
 * Registers unique page hit, and redirects to home
 */
app.get('/analytics/hit', async (req, res) => {
    await db.get('hits')
        .then(async hit => {
            const previousHits = await db.get('hits')
            const newHits = Number(previousHits) + 1
            await db.put("hits", String(newHits))

        })
        .catch(async error => {
            if (error["notFound"]) {
                await db.put("hits", "1")
            }
        });
    res.redirect('/')
})

/**
 * Nearly the same as /analytics/hit but only reads hits and doesn't append to them
 * Returns JSON: {"Hits": "numberOfHits}
 */
app.get('/analytics', async (req, res) => {
    let jsonResponse
    await db.get('hits')
        .then(async hit => {
            jsonResponse = await db.get('hits')

        })
        .catch(async error => {
            if (error["notFound"]) {
                jsonResponse = "It appears no hits have been made yet"
            }
        });
    res.send({"Hits": jsonResponse})
})


// Start Server
app.listen(PORT, async () => {
    console.log(`DeviceSync Listening For Connections At: http://localhost:${PORT}`)
})
