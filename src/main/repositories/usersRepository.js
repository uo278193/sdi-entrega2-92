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
    getUsers: async function (filter, options,page) {


        try {
            const limit = 4;
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const songsCollectionCount = await songsCollection.count();
            const cursor = songsCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const songs = await cursor.toArray();
            const result = {songs: songs, total: songsCollectionCount};
            return result;
        } catch (error) {
            throw (error);
        }



        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const cursor = usersCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const users = await cursor.toArray();
            return users;
        } catch (error) {
            throw (error);
        }
    }
};