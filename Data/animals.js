const db = require('./collections');
var ObjectId = require('mongodb').ObjectId;
const postData = require('./posts');
const connection = require('./connection');

function isValidString(test){
    if(!(typeof test ==='string' || test instanceof String)){
        throw "Parameter is not a string"
    }
    return;
}
async function create(name, animalType, likes){
    if(!name){
        throw "No name specified."
    }
    if(!animalType){
        throw "No animal type specified."
    }
    isValidString(name);
    isValidString(animalType);
    let newAnimal={
        name : name,
        animalType : animalType,
        likes : likes
    }
    const animals = await db.getCollection("animals");
    const insertCount = await animals.insertOne(newAnimal);
    if (insertCount.insertedCount===0){
        throw "Could not add animal";
    }
    const id = insertCount.insertedId;
    const animal = await get(id.toString());
    return animal;
}
async function addLike(animalId, postId){
    const animals = await db.getCollection("animals");
    const animal = await animals.findOne({_id: ObjectId(animalId)});
    var likes = animal.likes;
//    console.log("add like function : Likes :");
//    console.log(likes);
    if(!likes.includes(postId.toString())){
        likes.push(postId.toString());
        const updateCount =  await animals.updateOne({_id: ObjectId(animalId)},{$set: {likes: likes}});
//    console.log("After update");
        if(updateCount.modifiedCount===0){
            throw "Could not update likes"
        }
    }
    return;
}

async function deleteLike(animalId, postId){
    const animals = await db.getCollection("animals");
    const animal = await animals.findOne({_id: ObjectId(animalId)});
    var likes = animal.likes;
    console.log("coming in function");
    if(likes.includes(postId.toString())){
        var result = _.without(likes, postId.toString());
        const updateCount =  await animals.updateOne({_id: ObjectId(animalId)},{$set: {likes: result}});
        if(updateCount.modifiedCount===0){
            throw "Could not delete likes"
        }
    }
    return;
}

async function get(id){
    if(!id){
        throw "No ID provided."
    }
    isValidString(id);
    const animals = await db.getCollection("animals");
    const animal = await animals.findOne({_id: ObjectId(id)});
    if(animal === null){
        throw "No animal with that id."
    }
    authorposts = await postData.getPostsByAuthor(animal._id.toString());
    likes = await postData.getPostsFromLikes(animal.likes);
    animalData = {
        _id : animal._id,
        name : animal.name,
        animalType : animal.animalType,
        likes : likes,
        posts : authorposts
    }
    return animalData;
}

async function getAuth(id){
    if(!id){
        throw "No ID provided."
    }
    isValidString(id);
    const animals = await db.getCollection("animals");
    const animal = await animals.findOne({_id: ObjectId(id)});
    if(animal === null){
        throw "No animal with that id."
    }
    return animal;
}

async function getAll(){
    const animals = await db.getCollection("animals");
    const allAnimals= await animals.find({}).toArray();
//    console.log(allAnimals)
    const animalList = []
    for(var i = 0; i< allAnimals.length; i++ ){
        authorposts = await postData.getPostsByAuthor(allAnimals[i]._id.toString());
       /*  for (i in authorposts){
            console.log("Author posts for "+allAnimals[i].name +": "+authorposts[i].title);
            console.log("Khatam")
        } */
        likes = await postData.getPostsFromLikes(allAnimals[i].likes);
        animalData = {
            _id : allAnimals[i]._id,
            name : allAnimals[i].name,
            animalType : allAnimals[i].animalType,
            likes : likes,
            posts : authorposts
        }
//        console.log("Pushing this animal data: "+ animalData)

        animalList.push(animalData)
    }
    return animalList;
}


async function remove(id){
    if(!id){
        throw "No id provided."
    }
    isValidString(id);
    const animals = await db.getCollection("animals");
    const deleted = await get(id);
    const deleteCount = await animals.removeOne({_id: ObjectId(id)});
    if(deleteCount.deletedCount===0){
        throw "Animal not deleted."
    }
    retValue = {
        deleted : "true",
        data : deleted
    }
    return retValue;
}
async function getAnimalDataFromId(animalId){
    const animals = await db.getCollection("animals");
    const animal = await animals.findOne({_id: ObjectId(animalId)},{fields: {name: 1}});
    return animal;
}
async function rename(id, newName, newType){
    if(!id){
        throw "No id provided";
    }
    if(!newName){
        throw "No name provided to update."
    }
    if(!newType){
        throw "No type provided to update."
    }
    isValidString(id);
    isValidString(newName);
    isValidString(newType);
    const animals = await db.getCollection("animals");
    const updateCount = await animals.updateOne({_id: ObjectId(id)},{$set: {name: newName}});
    if (updateCount.modifiedCount===0){
        throw "Could not update name."
    }
    const updateCount2 = await animals.updateOne({_id: ObjectId(id)},{$set: {animalType: newType}});
    if (updateCount2.modifiedCount===0){
        throw "Could not update type."
    }
    return await get(id);
}


module.exports={
    create,
    get,
    getAll,
    remove,
    rename,
    getAnimalDataFromId,
    addLike,
    getAuth,
    deleteLike
}

 async function main(){
   try{
       /* const err = await create("Sasha","Dog",["ani","aki"]);
       console.log(err);
       const err2= await create("Lucy","Dog",["Manoj"]);
       console.log(err2);
       const err3 = await postData.create("Dogtales I", "Sasha","This is one story");
       console.log(err3);
       const err4 = await postData.create("Dogtales II", "Sasha", "This is another story");
       console.log(err4);  */
       
     //  const err = await rename("5c9afd6bfbf99a048462f513", "Yash", "Hyena");
    //   const err = await addLike("5c9afd6bfbf99a048462f514","5c9afd6bfbf99a048462f515");
    //  console.log("Animal Format: ")
    //   console.log(err);
       
   } catch(e){
       console.log(e);
   }
   
}
main(); 