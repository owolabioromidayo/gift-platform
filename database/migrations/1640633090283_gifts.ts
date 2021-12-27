import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Gifts extends BaseSchema {
  protected tableName = 'gifts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamps(true)

      table.string('sender_name').notNullable()
      table.string('sender_email').notNullable()
      table.string('receiver_name').notNullable()
      table.string('receiver_email').notNullable()
      table.float('amount')
      table.bigInteger('pin')
      table.string('note_to_receiver')
      table.boolean('claimed')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

