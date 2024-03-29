/**
 * Called when copy is pressed on a NoteView
 * @param elementID The ID of the noteview content textarea
 */
function copyNoteContents(elementID) {
    let textToCopy = document.getElementById(elementID).value;
    ClipboardJS.copy(textToCopy)
    alert("Copied note to clipboard");
}

/**
 * Called when edit is pressed on a NoteView
 */
function editNote(noteTitle) {
    let toToggle = true
    // If the text box is already visible, check if this was from a previous note being edited or if the edit button
    // should act as normal upon click
    if (!document.getElementById("editNoteCardForm").classList.contains("is-hidden")) {
        if (document.getElementById("saveNoteEditsButton").onclick.toString().search(`"${noteTitle}"`) === -1) {
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

/**
 * Called when user presses "Clear Contents" button
 */
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

/**
 * Used to create a new NoteView
 * @param noteObj Object containing title and content of note
 * @returns {string} HTML code for the new NoteView
 */
function newNoteView(noteObj) {
    let textBoxRowsNeeded = noteObj.Content.split("\n").length + 2
    return `<pre><input id="${noteObj.Title}Checkbox" onclick="updateNoteSelection()" type="checkbox"><h4 class="text-center text-primary">${noteObj.Title}</h4><details><summary>View Content</summary><textarea readonly rows="${textBoxRowsNeeded}" class="noteContent textfield noteCardInput" id="${noteObj.Title}ContentBox">${noteObj.Content}</textarea></details>
    <div class="col is-horizontal-align">
    <button onclick='deleteNote("${noteObj.Title}")' class="button primary"><i class="bi bi-trash"></i></button>
    <button onclick='copyNoteContents("${noteObj.Title}ContentBox")' class="button primary"><i class="bi bi-clipboard"></i></button><button
            class="button primary" onclick='editNote("${noteObj.Title}")'><i class="bi bi-pencil"></i></button><button</pre>`
}

/**
 * Iterates through user notes, and creates a note view for each note (if any)
 * @returns {Promise<void>}
 */
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

/**
 * Used to delete a single note, called when delete button is pressed on a NoteView
 */
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

/**
 * Called upon checkbox input on a NoteView to refresh the state of the button.
 */
function updateNoteSelection() {

    // Get state of all checkboxes for notes and store to 'noteSelections' object
    let noteSelections = {}
    for (const element of document.getElementById("notesViewDiv").children) {
        let parsedNoteCheckedData = parseNoteView(element) // Contains ID of checkbox and value of checked in an array
        noteSelections[parsedNoteCheckedData[0]] = parsedNoteCheckedData[1]
    }

    let enableButton = false
    // Iterate through noteSelections, if at least one was selected, enable 'delete selected' button, otherwise disable it
    for (const property in noteSelections) {
        if (noteSelections[property]) {
            enableButton = true
        }
    }
    enableButton ? document.getElementById("deleteSelectedButton").removeAttribute("disabled") :
        document.getElementById("deleteSelectedButton").setAttribute("disabled", "")
    return noteSelections
}

/** Return a key, value pair inside an array containing the specified NoteView's checkbox input id, and if it is checked
 * @param {Element} noteView
 */
function parseNoteView(noteView) {
    return [noteView.getElementsByTagName("input")[0].id, noteView.getElementsByTagName("input")[0].checked]
}

/**
 * Used to delete multiple notes, called when delete button is pressed on a NoteView
 */
async function deleteSelectedNotes() {
    let response = confirm("Are you sure you want to delete these selected notes?");
    if (response) {
        let selectedNoteObject = updateNoteSelection()
        let selectedNotes = []
        for (let noteTitle in selectedNoteObject) {
            if (selectedNoteObject[noteTitle]) {
                selectedNotes.push(noteTitle.replace("Checkbox", ""))
            }
        }
        console.log(selectedNotes)
        for (const noteTitle of selectedNotes) {
            console.log("Currently on " + noteTitle)
            let formData = {
                title: noteTitle
            };

            $.ajax({
                type: "POST",
                url: "/account/deleteNote",
                data: formData,
                dataType: "json",
                encode: true,
            })
        }
        //window.location.reload()
    }
}