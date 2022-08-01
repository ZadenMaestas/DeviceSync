function properHTMLInsert(id, element) {
    document.getElementById(id).innerHTML += element;
}

// Note Functions

function clearDraftedNote(){

}

function isSignedIn() {
    let session = Cookies.get("loginSession")
    if (session) {
        properHTMLInsert("logoutDiv", "<details class='dropdown'> <summary class='button outline primary'><img src='https://avatars.dicebear.com/api/initials/test.svg' alt='Account Profile Picture'></summary> <div class='card profileCard'><p><a href='logout.php' class='text-error'>Logout</a></p></div> </details>")
    } else {
        console.info("No Login Session Found")
    }
}