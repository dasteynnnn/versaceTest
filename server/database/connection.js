const mongoose = require('mongoose');
let username = process.env.uname || "root";
let password = process.env.pword || "sGkMCu1c91C2s5ax";
//const mongoConnection = `mongodb+srv://${username}:${password}@cluster0.dx6mz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//const mongoConnection = `mongodb+srv://${username}:${password}@cluster0.dx6mz.mongodb.net/?retryWrites=true&w=majority`;
const mongoConnection = 'mongodb+srv://'+username+':'+password+'@cluster0.dx6mz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const connectDB = async () => {
    try{
        //mongodb connections string
        const con = await mongoose.connect(mongoConnection, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            //useFindAndModify:false,
            //useCreateIndex:true
        })

        console.log(`MongoDB connected:${con.connection.host}`)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB