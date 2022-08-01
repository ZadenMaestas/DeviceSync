<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DeviceSync</title>
    <link rel="stylesheet" href="https://unpkg.com/chota@latest">
    <!--
    darkmode.js checks the theme settings for the browser and sets dark mode accordingly-->
    <script defer src="../assets/js/darkmode.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"
            integrity="sha256-0H3Nuz3aug3afVbUlsu12Puxva3CP4EhJtPExqs54Vg=" crossorigin="anonymous"></script>
    <script src="../assets/js/utils.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
    <div class="noteSelector">
        <p>A</p>
        <button class="button primary icon-only"><i class="bi bi-trash"></i></button>
        <button class="button primary icon-only"><i class="bi bi-share"></i></button>
        <button class="button primary icon-only"><i class="bi bi-clipboard"></i></button>
        <button class="button primary icon-only"><i class="bi bi-trash"></i></button>
    </div>
    <div class="active-noteSelector">
        <p>A</p>
        <button class="button primary icon-only"><i class="bi bi-trash"></i></button>
        <button class="button primary icon-only"><i class="bi bi-share"></i></button>
        <button class="button primary icon-only"><i class="bi bi-clipboard"></i></button>
        <button class="button primary icon-only"><i class="bi bi-trash"></i></button>
    </div>
</div>
</body>
</html>