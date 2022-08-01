<?php
if (isset($_POST["username"]) and isset($_POST["password"])) {
    include "accountDB.php";
}
?>
<form action="myAccount.php?mode=signup" method="POST">
    <fieldset id="signUpForm">
        <legend>Sign Up</legend>
        <p>
            <label for="usernameInput">Username</label>
            <input id="usernameInput" type="text" name="username" placeholder="Username">
        </p>
        <p>
            <label for="passwordInput">Password </label>
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
        <p><a href="myAccount.php?mode=signin">Already have an account? You can sign in here.</a></p>
    </fieldset>
</form>