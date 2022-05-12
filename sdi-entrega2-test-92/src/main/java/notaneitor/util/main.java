package notaneitor.util;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerApi;
import com.mongodb.ServerApiVersion;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.InsertOneResult;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Arrays;

public class main {

    public static void main(String[] args) {
        //MongoUtils prueba=new MongoUtils();
        ConnectionString connectionString = new ConnectionString("mongodb+srv://admin:admin@sdi-entrega2-92.qguw0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .serverApi(ServerApi.builder()
                        .version(ServerApiVersion.V1)
                        .build())
                .build();
        MongoClient mongoClient = MongoClients.create(settings);
        MongoDatabase database = mongoClient.getDatabase("sdistagram");
        database.createCollection("students");
        //Preparing a document

        Document document = new Document();
        document.append("name", "Ram");
        document.append("age", 26);
        document.append("city", "Hyderabad");
        //Inserting the document into the collection
        InsertOneResult result= database.getCollection("students").insertOne(document);
        System.out.println("Success! Inserted document id: " + result.getInsertedId());
    }
}
