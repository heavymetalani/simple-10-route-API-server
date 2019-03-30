const MongoClient = require("mongodb").MongoClient;
let serverUrl="mongodb://localhost:27017/";
let database="Aniruddha_Pimple_lab7";
//let testdb="testlab7";

let _connection = undefined;
let _db = undefined;

async function dbinit(){
    if(!_connection){
        _connection = await MongoClient.connect(serverUrl, { useNewUrlParser: true });
        _db = await _connection.db(database);
    }
    return _db;
}

module.exports={
dbinit
}