const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


process.on('uncaughtException', (err) => {
  console.log('UNCAUGHTEXCEPTION');
  console.log(err.name,err.message);
  process.exit(1);
});

const app = require('./app');

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
  .then((con) => {
    console.log('DB CONNECTED!!');
  });
  
// START SERVER
const port = 3000;
const server = app.listen(port, () => {
  console.log('Server Started');
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLEREJECTION');
  console.log(err.name,err.message);
  server.close(() => {
    process.exit(1);
  });
});

