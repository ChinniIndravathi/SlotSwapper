require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/slotswapper';
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URI).then(()=>{
  console.log('Connected to MongoDB');
  app.listen(PORT, ()=>console.log('Server running on port', PORT));
}).catch(err=>{
  console.error('Mongo connection error', err);
});
