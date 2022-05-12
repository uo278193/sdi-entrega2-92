package notaneitor.util;

import com.mongodb.*;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

public class MongoUtils {

    MongoDatabase database;
    MongoClient mongoClient;
    MongoClientSettings settings;
    ConnectionString connectionString;


    public MongoUtils() {
        createDataBaseConnection();
    }


    private void createDataBaseConnection() {
        connectionString = new ConnectionString("mongodb+srv://admin:admin@sdi-entrega2-92.qguw0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
        settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .serverApi(ServerApi.builder()
                        .version(ServerApiVersion.V1)
                        .build())
                .build();
        mongoClient = MongoClients.create(settings);
        database = mongoClient.getDatabase("sdistagram");
    }
    public void dropDataBase(){

    }

    public void createUsers() {

    }
    public void deleteFriendship(String user1, String user2){
        MongoCollection<Document> users = database.getCollection("users");
        Bson filter = Filters.eq("email", user1);
        Bson update = Updates.popLast("friends");
        FindOneAndUpdateOptions options = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);
        Document result = users.findOneAndUpdate(filter, update, options);

        filter = Filters.eq("email", user2);

        options = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);
        result = users.findOneAndUpdate(filter, update, options);

    }
}
