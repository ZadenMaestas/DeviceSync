const bcrypt = require('bcryptjs') // Encryption module
const {Level} = require('level') // For type inference

/**
 *
 * @param userSession {UserSession} The active user session to use
 * @param operation ["create", "read" "update", "delete"]
 * @param note
 */
class NoteManager {
    constructor(userSession) {
        this.userSession = userSession
    }

    /**
     * Creates new note if not already existing and if auth details are valid
     * @param {{Content: string, Title: string}} note Note object with title and content to save
     */
    async newNote(note) {
        const username = this.userSession.username
        const user = await this.userSession.getUser()
        let updatedUserInfo = user
        // Check if note already exists
        let existingNotes = user.Notes
        let alreadyExisting = false
        for (let iteratedNote in existingNotes) {
            let noteObj = existingNotes[iteratedNote]
            if (noteObj.Title === note.Title) {
                alreadyExisting = true
            }
        }
        if (!alreadyExisting) {
            updatedUserInfo.Notes.push(note)
            await this.userSession.db.put(username, updatedUserInfo)
            return {"Success": "Successfully Added Note"}
        } else if (alreadyExisting) {
            return {"Error": "A note already exists under that title"}
        }
    }

    /**
     * Gets user notes if auth details are valid
     */
    async getNotes() {
        const user = await this.userSession.getUser()
        const notes = user.Notes
        return {"Notes": notes}
    }

    /**
     * Edits specified note if existing and if auth details are valid
     * @param {{Content: string, Title: string}} note Note object with title and content to alter
     */
    async editNote(note) {
        const username = this.userSession.username
        const user = await this.userSession.getUser()
        let updatedUserInfo = user
        // Check if note already exists
        let existingNotes = user.Notes
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
            await this.userSession.db.put(username, updatedUserInfo)
            return {"Success": "Successfully Updated Note"}
        } else if (!alreadyExisting) { // If note isn't existing it can't be edited, so return error
            return {"Error": "No note exists under that name."}
        }
    }

    /**
     * Deletes specified note if existing and if auth details are valid
     */
    async deleteNote(noteTitle) {
        const username = this.userSession.username
        const user = await this.userSession.getUser()
        let updatedUserInfo = user
        // Check if note already exists
        let existingNotes = user.Notes
        let alreadyExisting = false
        let newNotes = []
        for (let iteratedNote in existingNotes) {
            let noteObj = existingNotes[iteratedNote]
            if (noteObj.Title === noteTitle) {
                alreadyExisting = true
            } else {
                // Add all notes that aren't the note to be deleted to a new array to replace the existing user notes
                newNotes.push(noteObj)
            }
        }
        if (alreadyExisting) {
            updatedUserInfo.Notes = newNotes // Overwrite old notes
            await this.userSession.db.put(username, updatedUserInfo)
            return {"Success": "Successfully Deleted Note"}
        } else if (!alreadyExisting) { // If note isn't existing it can't be deleted, so return error
            return {"Error": "No note exists under that name."}
        }

    }
}

/**
 * User Session Manager Class
 * @param {Level} db LevelDB Instance
 * @param {string} username User's username
 * @param {string} password User's password
 * @param {string} session_type signin or signup
 */
class UserSession {
    constructor(db, username, password, session_type = "signin") {
        this.db = db
        this.username = username
        this.password = password
        this.session_type = session_type
    }

    /** Initialization function which returns a promise of whether the sign-in or signup was successful
     * @returns {Promise<string>}
     */
    async init() {
        if (this.session_type === "signin") {
            return await this.loginUser()
        } else if (this.session_type === "signup") {
            return await this.createUser()
        }
    }

    /**
     * Fetches specified user if existing from the DB, otherwise returns null
     */
    async getUser() {
        let toReturn
        await this.db.get(this.username)
            .then(user => {
                toReturn = user
            })
            .catch(() => {
                toReturn = null
            })
        return toReturn
    }

    /**
     * Deletes specified user from DB if existing and if auth details are valid
     */
    async deleteUser() {
        const isExistingUser = await this.getUser()
        if (!isExistingUser) {
            return "Cannot delete non-existing user"
        } else {
            // Validate user password before doing anything else
            const result = bcrypt.compareSync(this.password, isExistingUser.Password)
            if (isExistingUser.Username === this.username && result) {
                let toReturn
                // Remove existing user if password was correct
                await this.db.del(this.username)
                    .then(() => {
                        toReturn = `Successfully Deleted ${this.username}`
                    })
                    .catch(() => {
                        toReturn = "Database error"
                    })
                return toReturn
            } else {
                return "Incorrect Password"
            }
        }
    }

    /**
     * Fetches specified user if existing from the DB, otherwise returns null
     */
    async createUser() {
        const isExistingUser = await this.getUser()
        // If username is not taken, proceed with creating account
        if (!isExistingUser) {
            // Hash password for security
            const hashed = bcrypt.hashSync(this.password, 5)
            // Save to DB and return success response
            await this.db.put(
                this.username,
                {
                    "Username": this.username,
                    "Password": hashed, "Notes": [], "ToDos": []
                })
            return "User has been created successfully"
        } else {
            return "User Exists"
        }
    }

    /**
     * Logs in specified user if existing and if auth details are valid
     */
    async loginUser() {
        const isExistingUser = await this.getUser(this.db, this.username)
        if (isExistingUser) {
            // If user exists, validate credentials
            const result = bcrypt.compareSync(this.password, isExistingUser.Password)
            if (isExistingUser.Username === this.username && result) {
                return "Successfully Signed In"
            } else {
                return "Invalid login details"
            }
        } else {
            return "Invalid login details"
        }
    }
}

module.exports = {UserSession, NoteManager};