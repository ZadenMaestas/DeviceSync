<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DeviceSync</title>
    <link rel="stylesheet" href="https://unpkg.com/chota@latest">
    <!--
    darkmode.js checks the theme settings for the browser and sets dark mode accordingly-->
    <script defer src="assets/js/darkmode.js"></script>
    <script src="assets/js/utils.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<div class="container">
    <nav class="nav">
        <div class="nav-left">
            <a class="brand active" href="index.php">DeviceSync</a>
            <div class="tabs">
                <a href="index.php" class="active">Home</a>
                <a href="myAccount.php">Account</a>
            </div>
        </div>
        <div id="logoutDiv" class="nav-right">
            <script>
                console.log(Session(""))
                if (sessionStorage.getItem("session")) {
                    properHTMLInsert("logoutDiv", "<details class='dropdown'> <summary class='button outline primary'>My Profile</summary> <div class='card profileCard'><p><a href='/api/v2/logout.php' class='text-error'>Logout</a></p></div> </details>")
                } else {
                    console.info("No Session Exists")
                }
            </script>
        </div>
    </nav>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <div class="row">
        <div class="text-center col">
            <h1 class="hero-header">About</h1>
            <h4>DeviceSync is an open source cross-platform note-taking application, it is licensed under the MIT
                License and the source code is available here: <a href="http://github.com/TheProtonDev/DeviceSyncApp"
                                                                  target="_blank">GitHub <i
                            class="bi bi-github"></i></a></h4>
        </div>
    </div>
    <div class="spacer"></div>
    <div class="row">
        <div class="text-center col">
            <h3 class="hero-header">Features:</h3>
            <h5><i class="bi bi-globe2"></i> Open Source</h5>
            <h5><i class="bi bi-arrow-repeat"></i> Cross Platform</h5>
            <h5><i class="bi bi-clipboard"></i> Shareable Paste System</h5>
        </div>
        <div class="text-center col">
            <h3 class="hero-header">Privacy:</h3>
            <h5><i class="bi bi-lock"></i> Your account password is stored securely in our database using BCrypt and
                your pastes are accessed via symmetric encryption using the account password</h5>
            <h5><i class="bi bi-cloud-check"></i> Unlike certain tech giants, I don't believe in using your data for
                monetary gain, if you want to support the project I accept <a href="https://ko-fi.com/zadenmaestas">donations</a>
            </h5>
        </div>
        <div class="text-center col">
            <h3 class="hero-header">Get Started:</h3>
            <button class="button outline primary">Sign Up</button>
            <br>
            <br>
            <p>Or</p>
            <button class="button outline primary">Sign In</button>
        </div>
    </div>
</div>
</body>
</html>