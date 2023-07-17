const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const fs = require('fs');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(console.log('DB CONNECTED SUCCESFULLY!!'))
  .catch(() => console.log('DB NOT CONNECTED'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);


const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const insertData = async () => {
  try {
    // await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false});
    // await Review.create(reviews);
    console.log('Data Added Successfully!!');
  } catch (err) {
    console.log('Some Error Occured!!');
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted Successfully!!');
  } catch (err) {
    console.log('Some Error Occured!!');
  }
  process.exit();
};
// deleteData();
insertData();
// console.log(process.args);

// if (process.args[2] === '--import') {
//   insertData();
// } else if (process.args[2] === '--delete') {
//   deleteData();
// }
