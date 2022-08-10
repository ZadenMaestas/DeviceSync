module.exports = {editNote, deleteNote, getNotes, newNote, createUser, getUser, loginUser, deleteUser}
const bcrypt = require('bcryptjs')

/**
 * Fetches specified user if existing from the DB, otherwise returns null
 * @param {string} username
 * @param db LevelDB Instance
 */
async function getUser(db, username) {
    let toReturn
    await db.get(username)
        .then(user => {
            toReturn = user
        })
        .catch(error => {
            toReturn = null
        })
    return toReturn
}

/**
 * Fetches specified user if existing from the DB, otherwise returns null
 * @param {string} username
 * @param db LevelDB Instance
 */
async function deleteUser(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (!isExistingUser) {
        return "Cannot delete non-existing user"
    } else {
        // Validate user password before doing anything else
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let toReturn
            // Remove existing user if password was correct
            await db.del(username)
                .then(response => {
                    toReturn = `Successfully Deleted ${username}`
                })
                .catch(err => {
                    toReturn = "Database error"
                })
            return toReturn
        } else {
            return "Incorrect Password"
        }
    }
}

async function createUser(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (!isExistingUser) {
        // If username is not taken, proceed with creating account

        // Hash password for security
        bcrypt.hash(password, 5, async function (err, hashed) {
            // Save to DB and return success response
            await db.put(username, {"Username": username, "Password": hashed, "Notes": [], "ToDos": []})
        });
        return "User has been created successfully"
    } else {
        return "User Exists"
    }
}

async function loginUser(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // If user exists, validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            return "Successfully Signed In"
        } else {
            return "Invalid login details"
        }
    } else {
        return "Invalid login details"
    }
}

async function deleteNote(db, note, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let updatedUserInfo = isExistingUser
            // Check if note already exists
            let existingNotes = isExistingUser.Notes
            let alreadyExisting = false
            let newNotes = []
            for (let iteratedNote in existingNotes) {
                let noteObj = existingNotes[iteratedNote]
                if (noteObj.Title === note.Title) {
                    alreadyExisting = true
                } else {
                    // Add all notes that aren't the note to be deleted to a new array to replace the existing user notes
                    newNotes.push(noteObj)
                }
            }
            if (alreadyExisting) {
                updatedUserInfo.Notes = newNotes // Overwrite old notes
                await db.put(username, updatedUserInfo)
                return {"Success": "Successfully Deleted Note"}
            } else if (!alreadyExisting) { // If note isn't existing it can't be deleted, so return error
                return {"Error": "No note exists under that name."}
            }
        }
    }
}

async function editNote(db, note, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let updatedUserInfo = isExistingUser
            // Check if note already exists
            let existingNotes = isExistingUser.Notes
            let alreadyExisting = false
            let newNotes = []
            newNotes.push(note) // Add updated note to new note list, then add old notes to it
            for (let iteratedNote in existingNotes) {
                let noteObj = existingNotes[iteratedNote]
                if (noteObj.Title !== note.Title) {
                    newNotes.push(noteObj)
                } else {
                    alreadyExisting = true
                }
            }
            if (alreadyExisting) {
                updatedUserInfo.Notes = newNotes // Overwrite old notes
                await db.put(username, updatedUserInfo)
                return {"Success": "Successfully Updated Note"}
            } else if (!alreadyExisting) { // If note isn't existing it can't be edited, so return error
                return {"Error": "No note exists under that name."}
            }
        }
    }
}

async function newNote(db, note, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let updatedUserInfo = isExistingUser
            // Check if note already exists
            let existingNotes = isExistingUser.Notes
            let alreadyExisting = false
            for (let iteratedNote in existingNotes) {
                noteObj = existingNotes[iteratedNote]
                if (noteObj.Title === note.Title) {
                    alreadyExisting = true
                }
                console.log(noteObj)
            }
            if (!alreadyExisting) {
                updatedUserInfo.Notes.push(note)
                await db.put(username, updatedUserInfo)
                return {"Success": "Successfully Added Note"}
            } else if (alreadyExisting) {
                return {"Error": "A note already exists under that title"}
            }
        }
    }
}

async function getNotes(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            const notes = isExistingUser.Notes
            return {"Notes": notes}
        }
    }
}
