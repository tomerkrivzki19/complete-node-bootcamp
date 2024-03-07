const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  // name: String,
  // we can make it more optional like defing snother stuuf not only the type of the value
  name: {
    type: String, // THIS IS THE DESCRIBTION FOR THE ERR ALERT THAT WILL JUMP -- THAT WAY WE WILL KNEW WHAT WENT WRONG
    required: [true, 'A tour most have a name '],
    // we cannot  have two tour elemnts with the same name ---   its mant to say that name is most to be uniqe
    unique: true,
    trim: true,
  },
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
  },
  ratingsAverage: {
    type: Number,
    // this is a defult value , if we not specify the value of rating the default will be 4.5
    default: 4.5,
    unique: false,
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
  proceDiscount: Number,
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
});
//                           most have a capital name at first -RULE !!
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
