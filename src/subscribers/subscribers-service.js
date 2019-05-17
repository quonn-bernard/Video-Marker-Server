const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/

// if password is less than 8 or longer than 72 chars, returns respective error
// message
const SubscribersService = {
    hasSubscriberWithUserName(db, user_name) {
        return db('subscribers')
            .where({user_name})
            .first()
            .then(subscriber => !!subscriber)
    },
    insertSubscribers(db, newSubscriber) {
        return db
            .insert(newSubscriber)
            .into('subscribers')
            .returning('*')
            .then(([subscriber]) => subscriber)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null

    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeSubscriber(subscriber) {
        return {
            id: subscriber.id,
            user_name: xss(subscriber.user_name),
            email: xss(subscriber.email_name),
            date_created: new Date(subscriber.date_created)
        }
    }
}

module.exports = SubscribersService

