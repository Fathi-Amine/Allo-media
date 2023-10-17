const  {default:mongoose} = require('mongoose')

const connectToDatabase =  (url) => {
    try {
        return mongoose.connect(url);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToDatabase