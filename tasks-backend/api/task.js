const moment = require('moment')

module.exports = app => {
    const getTasks = (request, response) => {
        const date = request.query.date ? request.query.date : moment().endOf('day').toDate()
        
        app.db('tasks')
            .where({ userID: request.user.id })
            .where('estimateAt', '<=', date)
            .orderBy('estimateAt')
            .then(tasks => response.json(tasks))
            .catch(error => response.status(500).json(error))
    }

    const save = (request, response) => {

        if (!request.body.description.trim()) {
            return response.status(400).send('Descrição é um campo obrigatório')
        }

        app.db('tasks').insert({
            description: request.body.description,
            estimateAt: request.body.estimateAt,
            userID: request.user.id,
        }).then(_ => {
            response.status(204).send()
        }).catch(error => {
            response.status(500).json(error)
        })
    }

    const remove = (request, response) => {
        app.db('tasks')
            .where({ id: request.params.id, userID: request.user.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    response.status(204).send()
                } else {
                    response.status(400).send(`Task de ID ${request.params.id} não encontrada`)
                }
            }).catch(error => {
                response.status(500).json(error)
            })
    }

    const updateDoneAt = (request, response, doneAt) => {
        app.db('tasks')
            .where({ id: request.params.id, userID: request.user.id })
            .update({ doneAt })
            .then(_ => response.status(204).send())
            .catch(error => response.status(500).json(error))
    }

    const toggleTask = (request, response) => {
        app.db('tasks')
            .where({ id: request.params.id, userID: request.user.id })
            .first()
            .then(task => {
                if (task) {
                    const doneAt = task.doneAt ? null : new Date()
                    updateDoneAt(request, response, doneAt)
                } else {
                    response.status(400).send(`Task de ID ${request.params.id} não encontrada`)
                }
            }).catch(error => {
                response.status(500).json(error)
            })
    }

    return { getTasks, save, remove, toggleTask }
}