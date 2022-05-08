module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },
    addFriend: async function(user, email){
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'friends';
            const friendsCollection = database.collection(collectionName);
            const result = await friendsCollection.insertOne(user);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },
    sendFriendRequest: async function(user,email){

    },
    getFriendRequest: async function(user){

    },
    getFriends: async function (filter, options,page) {
        try {
            const limit = 4;
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'friends';
            const friendsCollection = database.collection(collectionName);
            const friendsCollectionCount = await friendsCollection.count();
            const cursor = friendsCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const friends = await cursor.toArray();
            const result = {friends: friends, total: friendsCollectionCount};
            return result;
        } catch (error) {
            throw (error);
        }
    }




    ,addFriend: async function (user) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'friends';
            const friendsCollection = database.collection(collectionName);
            const result = await friendsCollection.insertOne(user);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    }, getFriendRequests: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'friends';
            const friendsCollection = database.collection(collectionName);
            return await friendsCollection.findOne(filter, options);
        } catch (error) {
            throw (error);
        }
    },
    getFriends: async function (filter, options,page) {
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