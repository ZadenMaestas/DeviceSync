function properHTMLInsert(id, element) {
    document.getElementById(id).innerHTML += element;
}

function themeCreator(){
    toggleElementVisibility("themeEditor")
}

function togglePasswordVisibility() {
    document.getElementById("passwordInput").type === "password" ? document.getElementById("passwordInput").type = "text" : document.getElementById("passwordInput").type = "password"
}

function toggleElementVisibility(elementId) {
    if (elementId === "editNoteCardForm") {
        // Make sure newNoteCardForm is hidden before toggling editNoteCardForm
        let isHidden = document.getElementById("newNoteCardForm").classList.contains("is-hidden")
        if (!isHidden) {
            document.getElementById("newNoteCardForm").classList.toggle("is-hidden")
        }
    } else if (elementId === "newNoteCardForm") {
        // Make sure editNoteCardForm is hidden before toggling newNoteCardForm
        let isHidden = document.getElementById("editNoteCardForm").classList.contains("is-hidden")
        if (!isHidden) {
            document.getElementById("editNoteCardForm").classList.toggle("is-hidden")
        }
    }
    document.getElementById(elementId).classList.toggle("is-hidden")
}

function deleteAccount() {
    let response = confirm("Are you sure you want to delete your account?");
    if (response) {
        window.location.href = "/account/delete"
    }
}
