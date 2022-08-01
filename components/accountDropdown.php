<?php
session_start();
$username = $_SESSION['loginSession'];
?>
<details class='dropdown'>
    <summary class='button outline primary'><img src='https://avatars.dicebear.com/api/initials/<?=$username?>.svg'
                                                 alt='Account Profile Picture'></summary>
    <div class='card profileCard'><p><a href='logout.php' class='text-error'>Logout</a></p></div>
</details>
