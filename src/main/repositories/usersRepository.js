module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    }, insertUser: async function (user) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const result = await usersCollection.insertOne(user);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    }, findUser: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            return await usersCollection.findOne(filter, options);
        } catch (error) {
            throw (error);
        }
    },
    updateUser: async function(user, filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'users';
            const songsCollection = database.collection(collectionName);
            const result = await songsCollection.updateOne(filter, {$set: user}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
    getUsers: async function (filter, options,page) {
        try {
            const limit = 4;
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const usersCollectionCount = await usersCollection.count();
            const cursor = usersCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const users = await cursor.toArray();
            const result = {users: users, total: usersCollectionCount};
            return result;
        } catch (error) {
            throw (error);
        }
    },
    updateUser: async function(user, filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'users';
            const songsCollection = database.collection(collectionName);
            const result = await songsCollection.updateOne(filter, {$set: user}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },

};