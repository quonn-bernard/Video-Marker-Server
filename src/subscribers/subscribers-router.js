const express = require('express')
const subscribersRouter = express.Router()
const jsonBodyParser = express.json()
const SubscribersService = require('./subscribers-service')
const path = require('path')
// makes a post request to '/' endpoint. Will return 400 with an error message,
// if fields any fields are left empty. Returns 'ok if all form inputs are
// valid
subscribersRouter.post('/', jsonBodyParser, (req, res, next) => {

    //request body set equal to password
    const {password, user_name, email} = req.body
    for (const index of['email',
        'user_name',
        'password']) 
        if (!req.body[index]) {
            return res
                .status(400)
                .json({error: `Missing '${index}' in request body`})
        }
    if (password.length < 8) {
        return res
            .status(400)
            .json({error: 'Password must be longer than 8 characters'})
    }
    const passwordError = SubscribersService.validatePassword(password)

    if (passwordError) 
        return res.status(400).json({error: passwordError})

    SubscribersService.hasSubscriberWithUserName(req.app.get('db'), user_name).then(hasSubscriberWithUserName => {
        if (hasSubscriberWithUserName) 
            return res.status(400).json({error: `Username already taken`})

        res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/whatever`))
            .json({
                id: 'whatever',
                user_name,
                email: email || '',
                date_created: Date.now()
            })
        return SubscribersService
            .hashPassword(password)
            .then(hashedPassword => {
                const newSubscriber = {
                    user_name,
                    password: hashedPassword,
                    email,
                    date_created: 'now()'
                }

                return SubscribersService.insertSubscribers(req.app.get('db'), newSubscriber).then(subscriber => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${subscriber.id}`))
                        .json(SubscriberService.serializeSubscriber(subscriber))
                })
            })
    }).catch(next)
})

module.exports = subscribersRouter