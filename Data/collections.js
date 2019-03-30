const dbConnection = require("./connection");

async function getCollection(collname){
    const db = await dbConnection.dbinit();
    const collection = await db.collection(collname);
    return collection;
}

module.exports={
    getCollection
}
    