const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    // name: String,
    // we can make it more optional like defing snother stuuf not only the type of the value
    name: {
      type: String, // THIS IS THE DESCRIBTION FOR THE ERR ALERT THAT WILL JUMP -- THAT WAY WE WILL KNEW WHAT WENT WRONG
      required: [true, 'A tour most have a name '],
      // we cannot  have two tour elemnts with the same name ---   its mant to say that name is most to be uniqe
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlenght: [10, 'A tour name must have more or qual then 10 characters'],
      // validator: [validator.isAlpha, 'Tour name must only contain characters'], //validator is an object that inside him we have all this tyoe of methods
    }, //specify a function that we use (validator),
    slug: String, //for the middleware of moongose we must to save the slug propartie in the mongoose
    duration: {
      type: Number,
      required: [true, 'A tour most have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour most have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour most have a difficulty'],
      enum: {
        //enum esure that the values that we set must be apllied from the client
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either :easy, medium, difficulty ',
      },
    },
    ratingsAverage: {
      type: Number,
      // this is a defult value , if we not specify the value of rating the default will be 4.5
      default: 4.5,
      unique: false,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      unique: false,
    },
    price: {
      type: Number,
      required: [true, 'A tour most have a price '],
    },
    priceDiscount: {
      type: Number, //for creating our own validators
      validate: {
        validator: function (val) {
          return val < this.price; // 100 < 200  -> true no err || 250 < 200 -> false trigaer a validation err
        }, //this keyword will only point on the current document when we will creat new document - not going to work on update req
        message: 'Discount price ({VALUE}) should be below the regular price',
      }, //      ({VALUE}) -> this peice here will get access to the value that was inputed
    },
    summary: {
      type: String,
      //  trim --> will remove all the white space in the begining and the end of the string
      trim: true,
      required: [true, 'A tour most have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String, // the image url || name will be displayed in the db
      required: [true, 'A tour most have a cover image'],
    },
    images: [String],
    createdAt: {
      //the time that the user created a tour
      type: Date, //js build in data type
      default: Date.now(), //give us a time stand in miliseconed -- then in mongo it will converted to a now date
      select: false, //propaty to hide from the putpot
    },
    startDates: [Date],
    secretTour: {
      typeof: Boolean,
      default: false,
    },
  },
  {
    //we can defind to a schma an object to basicly defing option to this schema
    toJSON: { virtuals: true }, //each time that the data is outputed as json we want viruals true, the virtuals be part of the output
    toObject: { virtuals: true }, // same but for objects to
  }
);

//virtual proparties --> proparties that we dont want to save inside the db , for example if we want to convert miles to kilometers there is no need of storing this type of proprtie in the db
//basicly if we using a virtual proparties we then could not use them inside qury, becouse this proparty does not inside the db
//what we could do is to do this conversion when we after we query the data like in the controller and this is not going to be a good practic becouse we want to try keep businnes logic and applicaion logic  as mutch speretaed as possible
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; //canculate the duration in weeks --> duration in days devided by 7 becouse we have seven days in a week
  //*we made a regular basic function and not a arrow function becouse we need the this keyword , and in arrow function we dont have access to a this keyword
  //! ususally if we need to use this keyword we will then use a regular function
});

//like in express middleware we can use also the mongoose middle-wares
//in mongoose there are 4 types of middleware :
//1.documement middleware -
//2.query middleware
//3.aggreation middleware
//4.model middleware

//in the mongoose middlewares we can basicly defind what going to happend when we saving the document in db and what will happen after and basicly things like this

//DOCUMENT MIDDLEWRE -- run before the save() command and .crete() command
//this pre mongoose function will give us the option to defind what going to be before the saving of a document
tourSchema.pre('save', function (next) {
  // console.log(this); //in this function we have access to the document that beeing proccess

  //  slug -->  just a string that we can put on the url , the is build in a simple string like the name
  //creating a slug for each of the document
  this.slug = slugify(this.name, { lower: true }); //lower-> make the lower to a big letters
  next();
});
//pre- save hook
// tourSchema.pre('save', function (next) {
//   console.log('Will save document ....');
//   next();
// });

// //  post -       hook
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//** we can add middleware before and after a serting event and in a event of document there will be a save event

//QUERY MIDDLEWARE --allow us run function berfore and after query documnets
//we can use this middle ware in this example ;
//if we have a vip tours and we want to hide it from the "public" -the other useers we can create a secret tour field and then query for all tours that are not secret
//the solution for the all find jooks - meaning that this /^find/ hook will work on all of the find methods
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); //not equal to true
  //clock how many time the req was executed :
  this.start = Date.now(); //the current time in miliseconed
  next();
});
//this method is working only for find , not findOne
//this is the soultion : the first sulotion is to vopy and change to findOne-not the best practic | the seconde solution for this is ansered up in the hook section

//will activate after the query alredy exuecuted
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconeds!`);
  // console.log(docs);
  next();
});
//צבירה
//AGGERATION MIDDLEWARE -- aloow us to add hooks before and after the aggreation happens
tourSchema.pre('aggregate', function (next) {
  // unshift() -> add a elemnt in a biggining of an array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //removing from the output all the elements that have secret tour set to true
  console.log(this.pipeline());
  next();
});

//data validation - cheking if the enterd values are in the right format for each field ot a document scehma and also that the vlaues hade actually been entered for all of the required fields
//we also have senitation -- it so insure that the inputed data is basiclly clean - remove unwonted data and remove them secure data!
//required -> build in data validator
// maxlenght -> build in data validator
//                           most have a capital name at first -RULE !!
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
