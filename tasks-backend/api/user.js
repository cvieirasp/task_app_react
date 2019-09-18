const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const getHash = (password, callback) => {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, null, (error, hash) => callback(hash))
        })
    }

    validateEmail = (email) => {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regex.test(String(email).toLowerCase())
    }

    const save = (request, response) => {
        getHash(request.body.password, hash => {

            if (!request.body.name.trim()) {
                return response.status(400).send('Nome é um campo obrigatório')
            } else if (!validateEmail(request.body.email)) {
                return response.status(400).send('Email com formato inválido')
            } 

            const password = hash
            app.db('users').insert({
                name: request.body.name,
                email: request.body.email,
                password,
            }).then(_ => {
                response.status(204).send()
            }).catch(error => {
                response.status(500).json(error)
            })
        })
    }

    return { save }
}