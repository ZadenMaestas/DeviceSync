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
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"
            integrity="sha256-0H3Nuz3aug3afVbUlsu12Puxva3CP4EhJtPExqs54Vg=" crossorigin="anonymous"></script>
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
            <?php
            if (isset($_SESSION['loginSession']) and $_COOKIE['loginSession'])
            include 'components/accountDropdown.php';
            ?>
        </div>
    </nav>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <div class="row">
        <div class="text-center col">
            <h1 class="hero-header">Welcome, <?=$_SESSION['loginSession'][0];?></h1>
        </div>
    </div>
    <div class="spacer"></div>
    <div class="row">
        <div class="text-center col">
            <h3 class="hero-header">Notes:</h3>
            <iframe src="components/myNotes.php"></iframe>
        </div>
        <div class="text-center col">
            <h3 id="currentPasteNameLabel" class="hero-header">New Paste</h3>
            <div class="card">
                <header>
                    <input class="textfield noteCardInput" placeholder="Title" name="noteTitle">
                </header>
                <textarea class="textfield noteCardInput" placeholder="Content" name="noteTitle"></textarea>
                <br>
                <footer>
                    <a class="button primary">Submit</a>
                    <a onclick="clearDraftedNote();" class="button">Clear Contents</a>
                </footer>
            </div>
        </div>
    </div>
    <?php
    include 'components/footer.php';
    ?>
</div>
</body>
</html>