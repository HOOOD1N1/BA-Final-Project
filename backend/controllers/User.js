const { pool } = require('../config/db/db')
const bcrypt = require('bcrypt')
const Sessions = require('./Sessions')
module.exports = {

    create: async(params) => {
        const { username, password, email } = params
        console.log("username " + username + " password " + password + " email " + email)
        if (username && password && email) {
            try {
                const userExists = await pool.query('SELECT id FROM "Users" where email=$1', [email])
                if (
                    // userExists ? .rows[0] ? .id
                    userExists && userExists.rows && userExists.rows[0] && userExists.rows[0].id
                ) {
                    return {
                        status: 'error',
                        message: 'USER_ALREDY_REGISTERED'
                    }
                }
                const date = new Date();
                const hash = await bcrypt.hash(password, 10)
                const result = await pool.query('INSERT INTO "Users" (email, username, password, creation_date) VALUES ($1, $2, $3, $4)', [email, username, hash, date])
                if (result.rowCount === 1) {
                    return {
                        status: 'success',
                        message: 'USER_REGISTERED_SUCCESSFULLY'
                    }
                }
            } catch (err) {
                console.error("there is an error")
                return {
                    status: 'error',
                    message: 'ERROR_REGISTERING_USER'
                }
            }
        } else {
            return {
                status: 'error',
                message: 'MISSING_PARAMETERS'
            }
        }
    },
    authenticate: async(params) => {
        const { email, password } = params;
        if (email && password) {
            try {
                const resultUser = await pool.query('SELECT id, email, password from "Users" where email=$1', [email])
                if (resultUser.rowCount === 1) {
                    const hash = resultUser.rows[0].password
                    const samePassword = await bcrypt.compare(password, hash)
                    if (samePassword === true) {
                        // password is correct
                        const sessionResult = Sessions.create({ userId: resultUser.rows[0].id })
                        console.log('authenticate: done');
                        return {
                            status: 'success',
                            message: 'USER_IS_AUTHENTICATED',
                            payload: (await sessionResult).payload
                        }
                    } else {

                        return {
                            status: 'error',
                            message: 'FAILED_COMPARING_PASSWORDS'
                        }
                    }
                }
            } catch (err) {
                console.error(err)
                return {
                    status: 'error',
                    message: 'FAILED_EXECUTING_QUERY'
                }
            }
        } else {
            return {
                status: 'error',
                message: 'MISSING_PARAMETERS'
            }
        }
    },
    update: async(params) => {},
    remove: async(params) => {},
    read: async(params) => {
        // find user
    }

}