exports.up = function(knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary()
        table.string('description').notNull()
        table.datetime('estimateAt')
        table.datetime('doneAt')
        table.integer('userID').references('id').inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks')
};