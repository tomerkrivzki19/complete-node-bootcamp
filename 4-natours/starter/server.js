const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    UseNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection succseful');
  })
  .catch((err) => {
    console.log(err, 'connnection to mongoDB failed');
  });

const tourSchema = new mongoose.Schema({
  // name: String,
  // we can make it more optional like defing snother stuuf not only the type of the value
  name: {
    type: String, // THIS IS THE DESCRIBTION FOR THE ERR ALERT THAT WILL JUMP -- THAT WAY WE WILL KNEW WHAT WENT WRONG
    required: [true, 'A tour most have a name '],
  },
  rating: {
    type: Number,
    // this is a defult value , if we not specify the value of rating the default will be 4.5
    default: 4.5,
    // we canot  have two tour elemnts with the same name ---   its mant to say that name is most to be uniqe
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour most have a price '],
  },
});
//                           most have a capital name at first -RULE !!
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  price: 997,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
    console.log('documnet is passed susscefuly');
  })
  .catch((err) => {
    console.log('ERR 💥:', err);
  });

// console.log(process.env); ---> give us the enviroment option that we current on inside node.js enviroment calss optin
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`app runing on port ${port}...`);
});
