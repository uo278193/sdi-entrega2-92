package notaneitor.util;


import com.mongodb.*;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.InsertOneResult;
import org.apache.commons.codec.binary.Hex;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

public class MongoUtils {

    MongoDatabase database;
    MongoClient mongoClient;
    MongoClientSettings settings;
    ConnectionString connectionString;


    public MongoUtils(){
        this.createDataBaseConnection();
    }
    public InsertOneResult crearUsuario() {
        return database.getCollection("users").insertOne(new Document().append("prueba", "prueba1"));
    }

    public void createDataBaseConnection() {
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

    public void closeClient() {
        mongoClient.close();
    }

    public static String encodePassword(String password) throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec("abcdefg".getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        return Hex.encodeHexString(sha256_HMAC.doFinal(password.getBytes("UTF-8")));
    }

    public void crearUsuarios() {
        try {
            database.createCollection("users");
            String key = "abcdefg";
            List<Document> listaUsers = new ArrayList<Document>();
            for (int i = 1; i < 10; ++i) {
                Document user = new Document();
                user.append("email", "user0" + i + "@email.com");
                user.append("nombre", "user0" + i);
                user.append("apellidos", "user 0" + i);
                user.append("admin", false);
                user.append("password", encodePassword("user0" + i));
                List<BasicDBObject> friends = new ArrayList<>();
                user.append("friends", friends);
                List<BasicDBObject> friendRequests = new ArrayList<>();
                user.append("friendRequests", friendRequests);
                listaUsers.add(user);
            }
            for (int i = 10; i < 16; ++i) {
                Document user = new Document();
                user.append("email", "user" + i + "@email.com");
                user.append("nombre", "user" + i);
                user.append("apellidos", "user " + i);
                user.append("admin", false);
                user.append("password", encodePassword("user" + i));
                List<BasicDBObject> friends = new ArrayList<>();
                user.append("friends", friends);
                List<BasicDBObject> friendRequests = new ArrayList<>();
                user.append("friendRequests", friendRequests);
                listaUsers.add(user);
            }
            //Inserting the document into the collection
            //database.getCollection("students").insertOne(document);
            database.getCollection("users").insertMany(listaUsers);
        } catch (Exception e) {

        }
    }

    public void borrarUsuarios() {
        database.getCollection("users").drop();
    }

    public void deleteFriendship(String user1, String user2) {
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
