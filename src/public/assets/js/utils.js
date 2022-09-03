////////////////////////////////////////////////////////////////
// Theming Functions //////////////////////////////////////////
///////////////////////////////////////////////////////////////

async function getThemeIfAny(){
    fetch("account/theme/get")
        .then(response => response.json())
        .then(json => {
            parseTheme(json.Theme)
        })
}

function parseTheme(theme){
    setCSSVar("color-primary", theme.primaryColor)
    setCSSVar("bg-secondary-color", theme.secondaryColor)
    theme.darkMode ? document.body.classList.add("dark") : document.body.classList.remove("dark")
}

function setCSSVar(varName, value) {
    document.body.style.setProperty(`--${varName}`, value);
}

function parseColor(cssVariable){
    const hexRegexCheck = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    const rgbRegexCheck = "^\\d{1,3},\\d{1,3},\\d{1,3}$"
    const otherRgbRegexCheck = "^\\d{1,3}, \\d{1,3}, \\d{1,3}$"

    let colorChosen = document.getElementById(`${cssVariable}ColorInput`).value
    // If HEX value was specified parse as such
    if (colorChosen.match(hexRegexCheck)){
        console.log("HEX Detected: "+colorChosen)
        if (cssVariable === "primary") cssVariable = "color-primary"
        if (cssVariable === "secondary") cssVariable = "bg-secondary-color"
        setCSSVar(cssVariable, colorChosen)
        return colorChosen
    } else if (colorChosen.match(rgbRegexCheck) || colorChosen.match(otherRgbRegexCheck)){
        console.log("RGB Detected: "+colorChosen)
        if (cssVariable === "primary") cssVariable = "color-primary"
        if (cssVariable === "secondary") cssVariable = "bg-secondary-color"
        setCSSVar(cssVariable, `rgb(${colorChosen})`)
        return `rgb(${colorChosen})`
    } else{ // If invalid color was specified
        alert(`Invalid color was specified in ${cssVariable}ColorInput.`);
    }
}

function previewThemeChanges(){
    let primaryColor = parseColor('primary')
    let secondaryColor = parseColor('secondary')
    let darkMode = document.getElementById("isDarkmode").checked
    document.getElementById("isDarkmode").checked ? document.body.classList.add("dark") : document.body.classList.remove("dark")
    const theme = {"primaryColor": primaryColor, "secondaryColor": secondaryColor, "darkMode": darkMode}
    console.log(theme)
}

////////////////////////////////////////////////////////////////
// Utility Functions ///////////////////////////////////////////
////////////////////////////////////////////////////////////////


function copyNoteContents(elementID) {
    let textToCopy = document.getElementById(elementID).value;
    ClipboardJS.copy(textToCopy)
    alert("Copied note to clipboard");
}

function editNote(noteTitle) {
    let toToggle = true
    // If the text box is already visible, check if this was from a previous note being edited or if the edit button
    // should act as normal upon click
    if (!document.getElementById("editNoteCardForm").classList.contains("is-hidden")){
        if (document.getElementById("saveNoteEditsButton").onclick.toString().search(`"${noteTitle}"`) === -1){
            // If the edit card was toggled from a previous note don't hide it
            toToggle = false
        }
    }
    if (toToggle) toggleElementVisibility('editNoteCardForm')
    document.getElementById("noteEditTitleInput").value = noteTitle
    document.getElementById("noteEditContentInput").value = document.getElementById(`${noteTitle}ContentBox`).value
    document.getElementById("saveNoteEditsButton").setAttribute("onclick", `saveNoteEdits("${noteTitle}")`)
    document.getElementById("noteEditContentInput").focus()
}

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

// Note Functions

function clearDraftedNote() {
    document.getElementById("noteTitleInput").value = ""
    document.getElementById("noteContentInput").value = ""
}

/**
 * For usage with edit note clear button, only clears the content box
 */
function clearContent() {
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
            for (let note of notes) {
                properHTMLInsert("notesViewDiv", newNoteView(note))
            }
        });
}

async function deleteNote(title) {
    let response = confirm("Are you sure you want to delete this note?");
    if (response) {
        let formData = {
            title: title
        };

        $.ajax({
            type: "POST",
            url: "/account/deleteNote",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            alert(data.Success || data.Error)
            if (data.Success) {
                window.location.reload()
            }
        });
    }
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
    // New Note Form Logic On Submit
    $("#newNoteForm").submit(function (event) {
        let formData = {
            title: $("#noteTitleInput").val(),
            content: $("#noteContentInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/newNote",
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
    // New Note Form Logic On Submit
    $("#editNoteForm").submit(function (event) {
        let formData = {
            title: $("#noteEditTitleInput").val(),
            content: $("#noteEditContentInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/editNote",
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
    // Prevent default on theme editor form submit
    $('#themeCreatorForm').submit(function(event) {
        let primaryColor = parseColor('primary')
        let secondaryColor = parseColor('secondary')
        if (primaryColor && secondaryColor) {
            document.getElementById("isDarkmode").checked ? document.body.classList.add("dark") : document.body.classList.remove("dark")
            let darkMode = document.getElementById("isDarkmode").checked
            const theme = {"primaryColor": primaryColor, "secondaryColor": secondaryColor, "darkMode": darkMode}
            let formData = {
                theme: theme,
            };

            $.ajax({
                type: "POST",
                url: "/account/theme/set",
                data: formData,
                dataType: "json",
                encode: true,
            }).done(function (data) {
                alert(data.Success || data.Error)
                if (data.Success) {
                    window.location.href = "/"
                }
            });
        }

        event.preventDefault();
    });
});
