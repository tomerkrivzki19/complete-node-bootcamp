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
    // UseNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection succseful');
  })
  .catch((err) => {
    console.log(err, 'connnection to mongoDB failed');
  });

// Example to creating a document :

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//     console.log('documnet is passed susscefuly');
//   })
//   .catch((err) => {
//     console.log('ERR 💥:', err);
//   });
// //////////////////////////////////////////////////////
// console.log(process.env); ---> give us the enviroment option that we current on inside node.js enviroment calss optin
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`app runing on port ${port}...`);
});
