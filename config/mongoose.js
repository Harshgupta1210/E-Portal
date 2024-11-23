const mongoose = require('mongoose');

// MongoDB Local URI
const localURI = 'mongodb://127.0.0.1:27017/E_portal';

// MongoDB Atlas URI with password
// const atlasURI = 'mongodb+srv://harshgupta1210304:12H@rsh10@e-portal.e62sx.mongodb.net/E_portal?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        // Attempt local connection first
        await mongoose.connect(localURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB (Local)');
    } catch (localError) {
        console.error('Error connecting to Local MongoDB:', localError.message);

        // If local fails, attempt Atlas connection
        try {
            await mongoose.connect(atlasURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Successfully connected to MongoDB (Atlas)');
        } catch (atlasError) {
            console.error('Error connecting to MongoDB Atlas:', atlasError.message);
            process.exit(1); // Exit process if both connections fail
        }
    }
};

connectDB();
