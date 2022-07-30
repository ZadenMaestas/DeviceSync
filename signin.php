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
                <a href="index.php">Home</a>
                <a class="active" href="myAccount.php">Account</a>
            </div>
        </div>
        <div id="logoutButtonContainer" class="nav-right">
            <details class="dropdown">
                <summary class="button outline primary">My Profile</summary>
                <div class="card profileCard">
                    <p><a href="/api/v2/logout.php" class="text-error">Logout</a></p>
                </div>
            </details>
        </div>
    </nav>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <form action="api/v2/login.php" method="POST">
        <fieldset id="forms__input">
            <legend>Sign In</legend>
            <p>
                <label for="usernameInput">Username</label>
                <input id="usernameInput" type="text" name="username" placeholder="Username">
            </p>
            <p>
                <label for="passwordInput">Password</label>
                <input id="passwordInput" type="password" name="password" placeholder="Type your Password">
            </p>
            <p>
                <button type="submit" class="button primary outline">Submit</button>
            </p>
        </fieldset>
    </form>
</div>
</body>
</html>