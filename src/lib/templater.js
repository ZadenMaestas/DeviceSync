module.exports = {viewEngine}
// Custom template engine for ExpressJS
const fs = require('fs')

function parseTemplate(template) {
    let navbar = ""
    let body = ""
    let templateLines = template.split("\n")

    let startOfNav = templateLines.indexOf("# Nav") + 1
    let startOfBody = templateLines.indexOf("# Body") + 1
    navbar = templateLines.slice(startOfNav, startOfBody - 1).join("\n")
    body = templateLines.slice(startOfBody, templateLines.length).join("\n")
    return {Navbar: navbar, Body: body}
}

/**
 * Custom View Engine For DeviceSync, might be overkill for what's needed, but I wanted to drastically reduce repeated HTML
 * @param filePath {string} The file to open
 * @param options {object} Options object to pass to view engine,
 * @param callback {function}
 */
function viewEngine(filePath, options, callback) {
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err)
        let isSignedInPage = false
        const pagesNeedingMyAccountButton = ["signedInHome.dstemplate", "myAccount.dstemplate"]
        for (let validPage of pagesNeedingMyAccountButton) {
            if (filePath.search(validPage) !== -1) {
                isSignedInPage = true
                break
            }
        }
        let myAccountButtonIfNeeded = ""
        if (isSignedInPage) {
            myAccountButtonIfNeeded = `<div id="logoutDiv" class="nav-right">
            <details class='dropdown'>
                <summary class='button outline primary'>My Account</summary>
                <div class='card profileCard'><p><a href='/logout' class='text-error'>Logout</a></p></div>
            </details>
        </div>`
        }

        const parsedTemplateInfo = parseTemplate(content.toString())
        const navTabs = parsedTemplateInfo.Navbar
        const body = parsedTemplateInfo.Body

        const head = `<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DeviceSync</title>
    <!-- Chota CSS Microframework and local stylesheet-->
    <link rel="stylesheet" href="https://unpkg.com/chota@latest">
    <script defer src="/assets/js/darkmode.js"></script> <!-- Dark-Mode Detection Setter -->
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <!-- JQuery ClipboardJS, and utils.js -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"
            integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="/assets/js/utils.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js"></script>
    <!-- SEO Tags-->
    <meta name="title" content="DeviceSync">
    <meta name="description" content="DeviceSync is an open source cross-platform note-taking application under the MIT License">
    <meta name="keywords" content="Note, Software, Zaden Maestas DeviceSync, DeviceSync, Zaden, Maestas, Cross platform note software, open source, oss, free note software">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="language" content="English">
    <meta name="revisit-after" content="7 days">
    <meta name="author" content="Zaden Maestas">
    <!-- OpenGraph Tags -->
    <meta property="og:title" content="DeviceSync">
    <meta property="og:site_name" content="DeviceSync">
    <meta property="og:url" content="https://devicesync.theprotondev.repl.co">
    <meta property="og:description" content="DeviceSync is an open source cross-platform note-taking application under the MIT License">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://opengraph.githubassets.com/1/zadenmaestas/devicesync">
    <!-- Web Manifest and favicon-->
    <link rel="icon" href="assets/imgs/favicon.ico">
    <link rel="manifest" href="/assets/webmanifest.json">
</head>`

        // Render body content based on options.page

        let toRender = `<!doctype html>
<html lang="en">
${head}
<body>
<div class="container">
    <!-- Navigation Bar -->
    <nav class="nav">
        <div class="nav-left">
            <a class="brand active" href="/">DeviceSync</a>
            <div class="tabs">
                ${navTabs}
            </div>
            ${myAccountButtonIfNeeded}
        </div>
    </nav>
    <div class="spacer"></div>
    <div class="spacer"></div>
    ${body}
    <footer class="text-center">
        <p><a href="https://github.com/ZadenMaestas/DeviceSync"><i class="bi bi-github"></i> Source Code</a> • <a
                href="https://github.com/ZadenMaestas/DeviceSync/issues/new"><i
                class="bi bi-bug-fill"></i> Report an issue</a> • <a href="https://ko-fi.com/zadenmaestas"
                                                                     target="_blank">🎗
            Donate</a></p>
        <h5>Made by <a href="https://github.com/ZadenMaestas" target="_blank">Zaden Maestas</a></h5>
    </footer>
</div>
</body>
</html>
`
        return callback(null, toRender)
    })
}
