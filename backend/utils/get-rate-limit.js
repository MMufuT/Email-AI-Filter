require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const getRateLimit = (mongoURI) => {
    const client = new MongoClient(mongoURI);
    client.connect(async (err) => {
        if (err) {
            console.error('Failed to connect to MongoDB:', err);
            return;
        }

        try {
            // Access the database
            const db = client.db('test');

            // Access the collection
            const collection = db.collection('rate-limits');

            // Find the document by its ObjectId
            const document = await collection.findOne({ _id: new ObjectId('64b80c77eb641d35b671e200') });

            // Return the retrieved document
            return document
        } catch (error) {
            console.error('Error retrieving document:', error);
        } finally {
            // Close the MongoDB client
            client.close();
        }
    });
}

module.exports = getRateLimit






