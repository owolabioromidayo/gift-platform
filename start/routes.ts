/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Route from '@ioc:Adonis/Core/Route';;
import User from 'App/Models/User'
import argon2 from 'argon2'
import Gift from 'App/Models/Gift';
import Transaction from 'App/Models/Transaction';




Route.post('/register', async({auth, request, response}) => {

    const params = request.requestBody

    const emailInUse = await User.findBy('email', params.email)

    if (emailInUse){
      return "Email in Use!"
    }

    const usernameInUse = await User.findBy('username', params.username)
    if(usernameInUse){
      return "Username in Use!"
    }

    const user = await User.create({    
      username: params.username,
      email: params.email,
      password: await argon2.hash(params.password),
      balance: 10000
    })

    console.log(user.$isPersisted)
    return user


})



Route.post('/login', async({auth, request, response}) => {
  const params = request.requestBody;

  const email = params.email
  const password = params.password

  try {
    const token = await auth.use('api').attempt(email, password) // use argon for password generation
    return token
  }
  catch {
    return response.badRequest('Invalid credentials')
  }

})


Route.post('/gift/give', async({auth, request, response}) => {

  await auth.use('api').authenticate();
  if (auth.use('api').isAuthenticated){

    const params = request.requestBody;

    const amount = params.amount;
    const recv_email = params.recv_email;
    const note_to_receiver = params.note;
    const user = auth.use('api').user!

    if (user.balance >= amount){
      try{
        const recv = await User.findByOrFail('email', recv_email)

        if (user.email === recv.email){
          return "Cannot send gift to same user!"
        }

        const pin = Math.floor(Math.random() * 10000000000)
        user.balance -= amount
        await user.save()

        
        await Gift.create({
          sender_name : user.username,
          sender_email: user.email,
          receiver_name: recv.username,
          receiver_email: recv.email,
          pin,
          note_to_receiver,
          claimed: false,
          amount: amount,
        })

        return {"status": `Gift Transferred Successfully. Your 10 digit code is ${pin}`, "balance": user.balance}

    } 
    catch{
      return "Gift recipient does not exist!"
    }
    }else{
      return "Insufficient funds!"
    }
  }else{
    return response.badRequest('Invalid token')
  }
})

Route.post('/gift/claim', async({auth, request, response}) => {
  await auth.use('api').authenticate();
  if (auth.use('api').isAuthenticated){
    const params = request.requestBody;
  
    const user = auth.use('api').user!
    const pin = params.pin

      try{

        const gift = await Gift.findByOrFail('pin', pin);
        if(user.email !== gift.receiver_email){
          return "You are not authorized to receieve this gift"
        }
        if(gift.claimed){
          return "You have already claimed this gift."
        }
      
        user.balance += gift.amount;
        await user.save();


        const transaction = await Transaction.create({
          receiver_name: user.username,
          receiver_email: user.email,
          source: 'GIFT',
          amount: gift.amount,
          gift_id: gift.id
        })

        await transaction.save()

        gift.claimed = true;
        await gift.save();
        return {"status": `Gift Received. Sender ${gift.sender_name} says ${gift.note_to_receiver}`, "balance": user.balance}

    } 
    catch (err){
       return "Gift does not exist"
    }
  }else{
    return response.badRequest('Invalid token')
  }
})
