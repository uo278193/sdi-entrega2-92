module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },
    getComments: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdistagram");
            const collectionName = 'comments';
            const postsCollection = database.collection(collectionName);
            const comments = await postsCollection.find(filter, options).toArray();
            return comments;
        } catch (error) {
            throw (error);
        }
    }, insertComment: function (comment, callbackFunction) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callbackFunction(null)
            } else {
                const database = dbClient.db("sdistagram");
                const collectionName = 'comments';
                const postsCollection = database.collection(collectionName);
                postsCollection.insertOne(comment)
                    .then(result => callbackFunction(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            }
        });
    }
};