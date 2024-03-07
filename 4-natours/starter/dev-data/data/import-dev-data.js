// here we building a scrip that will be independed from the rest of the code
//WE creating this to add a file that we have , read him with node.js and store it inside our DB collection
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// const config = require('../../config.env');
dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection succseful');
  })
  .catch((err) => {
    console.log('connnection to mongoDB failed', err);
  });

// Remove the unique index constraint on the rating field if null values are acceptable
// Tour.collection.dropIndex({ rating: 1 });

//   READ JSON FILE

const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data succesfuly loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//DELETE ALL DATA FROM COLLECTION -> DB

const deleteData = async () => {
  try {
    await Tour.deleteMany(); //deleteMany => pass nothing and it will delete all document in the collection
    console.log('data succesfuly deleted!');
  } catch (error) {
    console.log('Error deleting data:', error);
  }
  process.exit(); //kind of agrreive way to stopping apllication
};

// we can defind that when we are starting the single file , we can decide on whitch of the function it will started
//like we have --imported function || --delete function

// in this function it will work depending on the location for example:

// we have a three way point to the path that we are current using

//  'C:\\Program Files\\nodejs\\node.exe',
// 'C:\\Users\\krivi\\OneDrive\\Desktop\\complete-node-bootcamp\\4-natours\\starter\\dev-data\\data\\import-dev-data.js

//so we need to select the third path , that way we implementing that inside the function:

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Invalid command. Use --import or --delete.');
}

// then when we are calling to the file in the command we are basicliy add to it the --import | --delete sentnce to the end

console.log(process.argv);

//    STARTING THE FILE PROCEESS:
// we can start the file from the command line ,instead of startinf ot frm the server we can simaply start it ones and from the command line
// to start what we need to do , we need to follow this steps :

// *  first in the command line we need to locate the parent folder that the file is located
// !! -- we need to make sure that everything is on the right steps , like libary location.], imported stuff is on the right path etc..
// * secened we need to type inside the command line : node ____________ in this case - import-dev-data.js  --import
//                                                          file full name
