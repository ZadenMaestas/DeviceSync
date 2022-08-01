<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DeviceSync</title>
    <link rel="stylesheet" href="https://unpkg.com/chota@latest">
    <!--
    darkmode.js checks the theme settings for the browser and sets dark mode accordingly-->
    <script defer src="../../assets/js/darkmode.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"
            integrity="sha256-0H3Nuz3aug3afVbUlsu12Puxva3CP4EhJtPExqs54Vg=" crossorigin="anonymous"></script>
    <script src="../../assets/js/utils.js"></script>
    <link rel="stylesheet" href="../../assets/css/style.css">
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
        <div id="logoutDiv" class="nav-right">
            <script>isSignedIn()</script>
        </div>
    </nav>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <h2 style="text-align: center;" class="hero-header">Account Management Portal Coming Soon!</h2>
    <!--
    <form action="../login.php" method="post">
        <fieldset id="signInForm">
            <legend>My Account</legend>
            <p>
                <label for="usernameInput">Change username</label>
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
    -->
</div>
<?php
include 'components/footer.php';
?>
</body>
</html>