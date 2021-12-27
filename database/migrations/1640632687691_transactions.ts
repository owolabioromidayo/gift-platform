import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Gifts extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)

      table.string('receiver_name').notNullable()
      table.string('receiver_email').notNullable()
      table.float('amount')
      table.string('source').notNullable()
      table.bigInteger('gift_id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

