const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   //libreria che hasha la password in modo sicuro

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    favouriteSport: {
        type: String,
        required: true,
        enum: ['Calcio', 'Basket', 'Beach Volley', 'Ping Pong']
    },

})

userSchema.pre("save", function(next) {
    const user = this;    //oggetto corrente viene passato alla funzione
    bcrypt.hash(user.password, 10).then(hashedPassword => {  //operazione di hashing della password
      user.password = hashedPassword;  //restituzione password hashata
      next();
    })
  })
  
 
module.exports = mongoose.model('User', userSchema);