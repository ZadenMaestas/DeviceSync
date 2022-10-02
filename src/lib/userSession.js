const bcrypt = require('bcryptjs') // Encryption module
const {Level} = require('level') // For type inference

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

module.exports = {UserSession};