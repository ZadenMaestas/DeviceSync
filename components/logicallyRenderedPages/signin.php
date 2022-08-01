<?php
if (isset($_POST["username"]) and isset($_POST["password"])) {
    $_GET['mode'] = "signin";
    include "accountDB.php";
}
?>


<form action="myAccount.php" method="post">
    <fieldset id="signInForm">
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
            <script>
                function togglePasswordVisibility() {
                    document.getElementById("passwordInput").type === "password" ? document.getElementById("passwordInput").type = "text" : document.getElementById("passwordInput").type = "password"
                }
            </script>
            <label for="showPasswordCheckbox"><input onclick="togglePasswordVisibility();" id="showPasswordCheckbox"
                                                     type="checkbox">
                Show Password </label>
        </p>
        <p>
            <button type="submit" class="button primary outline">Submit</button>
        </p>
        <br>
        <p><a href="myAccount.php?mode=signup">Don't have an account yet? You can create one here.</a></p>
    </fieldset>
</form>