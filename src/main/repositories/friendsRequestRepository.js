module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },
    //DONE
    addFriend: async function(friendship){
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'friends';
            const friendsCollection = database.collection(collectionName);
            const result = await friendsCollection.insertOne(friendship);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },
    getFriends: async function (filter, options,page) {
        try {
            const limit = 5;
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
    },
    //DONE
    deleteFriendRequest: async function(filter){
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'friendRequest';
            const friendRequestCollection = database.collection(collectionName);
            const result = await friendRequestCollection.delete(filter);
            return result;
        } catch (error) {
            throw (error);
        }
    },
    getFriendRequests: async function (filter, options,page) {
        try {
            const limit = 5;
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'friendRequest';
            const friendRequestCollection = database.collection(collectionName);
            const friendRequestCollectionCount = await usersCollection.count();
            const cursor = friendRequestCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const friendRequests = await cursor.toArray();
            const result = {friendRequests: friendRequests, total: friendRequestCollectionCount};
            return result;
        } catch (error) {
            throw (error);
        }
    }

};