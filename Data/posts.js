const db = require('./collections');
var ObjectId = require('mongodb').ObjectId;
const animalData = require('./animals') 

function isValidString(test){
    if(!(typeof test ==='string' || test instanceof String)){
        throw "Parameter is not a string"
    }
    return;
}
async function create(title, author, content){
    if(!title){
        throw "No title specified."
    }
    if(!author){
        throw "No author specified."
    }
    if(!content){
        throw "No content specified"
    }
    isValidString(title);
    isValidString(author);
    isValidString(content);
    let newPost={
        title : title,
        author : author,
        content : content
    }
    const posts = await db.getCollection("posts");
    const insertCount = await posts.insertOne(newPost);
    if (insertCount.insertedCount===0){
        throw "Could not add post";
    }
    const id = insertCount.insertedId;
    return await get(id.toString());
}

async function get(id){
    if(!id){
        throw "No ID provided."
    }
    isValidString(id);
    const posts = await db.getCollection("posts");
    const post = await posts.findOne({_id: ObjectId(id)});
    if(post === null){
        throw "No post with that id."
    }
    animal = await animalData.getAnimalDataFromId(post.author);
    postFormat = {
        _id : post._id,
        title : post.title,
        content : post.content,
        author : animal
    }
    return postFormat;
}

async function getPostsByAuthor(author){
    if(!author){
        "No author specified."
    }
    isValidString(author);
    const posts = await db.getCollection("posts");
    const post = await posts.find({author: author}).project({title: 1}).toArray();
    if (post===null){
        return []
    }
    return post;
}

async function getPostDataFromId(postId){
const posts = await db.getCollection("posts");
const post = await posts.findOne({_id: ObjectId(postId)},{fields: {title: 1}});
return post;
}

async function getPostsFromLikes(likes){
    likeData = []
    for(var i=0; i<likes.length;i++){
        post = await getPostDataFromId(likes[i]);
        likeData.push(post);
    }
    return likeData;
}

async function getAll(){
    const posts = await db.getCollection("posts");
    const allPosts = await posts.find({}).toArray();
    postList = []
    
    for(var i=0; i<allPosts.length;i++){
        authorData = await animalData.getAnimalDataFromId(allPosts[i].author);
        postFormat = {
            _id : allPosts[i]._id,
            title : allPosts[i].title,
            content : allPosts[i].content,
            author : authorData
        }
        postList.push(postFormat);
    }
    return postList;
}

async function remove(id){
    if(!id){
        throw "No id provided."
    }
    isValidString(id);
    const posts = await db.getCollection("posts");
    const deleted = await get(id);
    const deleteCount = await posts.removeOne({_id: ObjectId(id)});
    if(deleteCount.deletedCount===0){
        throw "Post not deleted."
    }
    retValue = {
        deleted : "true",
        data : deleted
    }
    return retValue;
}
async function rename(id, newTitle, newContent){
    if(!id){
        throw "No id provided";
    }
    if(!newTitle){
        throw "No title provided to update."
    }
    if(!newContent){
        throw "No content provided to update."
    }
    isValidString(id);
    isValidString(newTitle);
    isValidString(newContent);
    const posts = await db.getCollection("posts");
    const updateCount = await posts.updateOne({_id: ObjectId(id)},{$set: {title: newTitle}});
    if (updateCount.modifiedCount===0){
        throw "Could not update title"
    }
    const updateCount2 = await posts.updateOne({_id: ObjectId(id)},{$set: {content: newContent}});
    if (updateCount2.modifiedCount===0){
        throw "Could not update content"
    }
    return await get(id);
}
module.exports={
    create,
    get,
    getPostsByAuthor,
    getPostsFromLikes,
    getAll,
    remove,
    rename
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
     //   const err = await getAll();
      //  console.log("Post Format: ")
      //  console.log(err);
        
    } catch(e){
        console.log(e);
    }
    
 }
 main(); 