import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class FirstUserSeeder extends BaseSeeder {
public static developmentOnly = true  //só pode ser executada quando a aplicação estiver em desenvolvimento

  public async run () {
    await User.create({
      email:'teste@teste.com',
      password: 'secret'
    })  
  }
}
