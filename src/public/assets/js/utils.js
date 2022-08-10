////////////////////////////////////////////////////////////////
// Utility Functions ///////////////////////////////////////////
////////////////////////////////////////////////////////////////
function copyNoteContents(elementID) {
    let textToCopy = document.getElementById(elementID).value;
    ClipboardJS.copy(textToCopy)
    alert("Copied note to clipboard");
}

function editNote(noteTitle) {
    toggleElementVisibility('editNoteCardForm')
    document.getElementById("noteEditTitleInput").value = noteTitle
    document.getElementById("noteEditContentInput").value = document.getElementById(`${noteTitle}ContentBox`).value
    document.getElementById("saveNoteEditsButton").setAttribute("onclick", `saveNoteEdits("${noteTitle}")`)
}

function properHTMLInsert(id, element) {
    document.getElementById(id).innerHTML += element;
}


function togglePasswordVisibility() {
    document.getElementById("passwordInput").type === "password" ? document.getElementById("passwordInput").type = "text" : document.getElementById("passwordInput").type = "password"
}

function toggleElementVisibility(elementId) {
    if (elementId === "editNoteCardForm") {
        // Make sure newNoteCardForm is hidden before toggling editNoteCardForm
        let isHidden = document.getElementById("newNoteCardForm").classList.contains("hidden")
        if (!isHidden) {
            document.getElementById("newNoteCardForm").classList.toggle("hidden")
        }
    } else if (elementId === "newNoteCardForm") {
        // Make sure editNoteCardForm is hidden before toggling newNoteCardForm
        let isHidden = document.getElementById("editNoteCardForm").classList.contains("hidden")
        if (!isHidden) {
            document.getElementById("editNoteCardForm").classList.toggle("hidden")
        }
    }
    document.getElementById(elementId).classList.toggle("hidden")
}

function deleteAccount() {
    let response = confirm("Are you sure you want to delete your account?");
    if (response) {
        window.location.href = "/account/delete"
    }
}

// Note Functions

async function saveNote() {
    let title = document.getElementById("noteTitleInput").value
    let content = document.getElementById("noteContentInput").value
    title = encodeURI(title)
    content = encodeURI(content)
    await fetch(`/account/newNote/${title}/${content}`)
        .then(response => response.json())
        .then(response => {
            alert(response.Error || response.Success)
            if (response.Success) {
                window.location.reload()
            }
        })
}

function clearDraftedNote() {
    document.getElementById("noteTitleInput").value = ""
    document.getElementById("noteContentInput").value = ""
}

/**
 * For usage with edit note clear button, only clears the content box
 */
function clearContent(){
    document.getElementById("noteEditContentInput").value = ""
}

function newNoteView(noteObj) {
    let textBoxRowsNeeded = noteObj.Content.split("\n").length + 2
    return `<pre><h4 class="text-center text-primary">${noteObj.Title}</h4><details><summary>View Content</summary><textarea readonly rows="${textBoxRowsNeeded}" class="noteContent textfield noteCardInput" id="${noteObj.Title}ContentBox">${noteObj.Content}</textarea></details>
    <div class="col is-horizontal-align">
    <button onclick='deleteNote("${noteObj.Title}")' class="button primary"><i class="bi bi-trash"></i></button>
    <button onclick='copyNoteContents("${noteObj.Title}ContentBox")' class="button primary"><i class="bi bi-clipboard"></i></button><button
            class="button primary" onclick='editNote("${noteObj.Title}")'><i class="bi bi-pencil"></i></button><button</pre>`
}

async function getNotes() {
    await fetch("/account/getNotes")
        .then(response => response.json())
        .then(notes => {
            notes = notes.Notes
            for (let note in notes) {
                let noteObj = notes[note]
                properHTMLInsert("notesViewDiv", newNoteView(noteObj))
            }
        });
}

async function deleteNote(title) {
    let response = confirm("Are you sure you want to delete this note?");
    if (response) {
        await fetch(`/account/deleteNote/${title}`)
            .then(response => response.json())
            .then(response => {
                alert(response.Error || response.Success)
                if (response.Success) {
                    window.location.reload()
                }
            })
    }
}

async function saveNoteEdits(title) {
    // Get the textarea note content
    let content = document.getElementById("noteEditContentInput").value
    await fetch(`/account/editNote/${title}/${content}`)
        .then(response => response.json())
        .then(response => {
            alert(response.Error || response.Success)
            if (response.Success) {
                window.location.reload()
            }
        })
}

////////////////////////////////////////////////////////////////
// Form Handling ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$(document).ready(function () {
    // Signup Form Logic On Submit
    $("#signUpForm").submit(function (event) {
        let formData = {
            username: $("#usernameInput").val(),
            password: $("#passwordInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/signup",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            alert(data.Success || data.Error)
            if (data.Success) {
                window.location.href = "/analytics/hit"
            }
        });

        event.preventDefault();
    });

    // Signin Form Logic On Submit
    $("#signInForm").submit(function (event) {
        let formData = {
            username: $("#usernameInput").val(),
            password: $("#passwordInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/signin",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            alert(data.Success || data.Error)
            if (data.Success) {
                window.location.href = "/"
            }
        });

        event.preventDefault();
    });
});
