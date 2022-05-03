module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },
    getPosts: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'posts';
            const postsCollection = database.collection(collectionName);
            return await postsCollection.find(filter, options).toArray();
        } catch (error) {
            throw (error);
        }
    }, findPost: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'posts';
            const postsCollection = database.collection(collectionName);
            const song = await postsCollection.findOne(filter, options);
            return song;
        } catch (error) {
            throw (error);
        }
    }, deletePost: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'posts';
            const postsCollection = database.collection(collectionName);
            const result = await postsCollection.deleteOne(filter, options);
            return result;
        } catch (error) {
            throw (error);
        }
    }, updatePost: async function (newPost, filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'posts';
            const postsCollection = database.collection(collectionName);
            const result = await postsCollection.updateOne(filter, {$set: newPost}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    }, insertPost: function (song, callbackFunction) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callbackFunction(null)
            } else {
                const database = dbClient.db("sdistagram");
                const collectionName = 'posts';
                const postsCollection = database.collection(collectionName);
                postsCollection.insertOne(song)
                    .then(result => callbackFunction(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            }
        });
    }, getPostsPg: async function (filter, options, page) {
        try {
            const limit = 4;
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'posts';
            const postsCollection = database.collection(collectionName);
            const postsCollectionCount = await postsCollection.count();
            const cursor = postsCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const posts = await cursor.toArray();
            const result = {posts: posts, total: postsCollectionCount};
            return result;
        } catch (error) {
            throw (error);
        }
    }
};