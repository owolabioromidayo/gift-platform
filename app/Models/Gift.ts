import { DateTime } from 'luxon'
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm'


export default class Gift extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public sender_name: String

  @column()
  public sender_email: String

  @column()
  public receiver_name: String

  @column()
  public receiver_email: String

  @column()
  public pin: number

  @column()
  public note_to_receiver: String

  @column()
  public amount: number
  
  @column()
  public claimed: Boolean

}
