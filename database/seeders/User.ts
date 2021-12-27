import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

  public async run () {
    await User.createMany([
      {
        username: "virk",
        email: 'virk@adonisjs.com',
        password: 'secret',
        balance: 0.12,
      },
      {
        username: "virkim",
        email: 'romain@adonisjs.com',
        password: 'supersecret',
        balance: 5000.0,
      }
    ])
  }

}
