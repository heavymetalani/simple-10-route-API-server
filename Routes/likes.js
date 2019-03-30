const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const animalData = data.animals;

router.post("/:id", async (req, res) => {
    try{
//        console.log(req.query.postId.toString());
        await postData.get(req.query.postId);
    } catch(e){
        res.status(404).json({ message: "no post with that id found!" });
        return;
    }
     try{
 //       console.log(req.params.id.toString());
        await animalData.getAuth(req.params.id.toString());
    } catch(e){
        res.status(404).json({ message: "no animal with that id found!" });
        return;
    }
    try{
        postID = req.query.postId.toString();
        animalID = req.params.id.toString();
        await animalData.addLike(animalID,postID);
        res.sendStatus(200);
    } catch (e){
        res.status(404).json({ message : "No success"});
        return;
    }
});

router.delete("/:id", async (req, res) => {
    try{
//        console.log(req.query.postId.toString());
        await postData.get(req.query.postId);
    } catch(e){
        res.status(404).json({ message: "no post with that id found!" });
        return;
    }
     try{
//        console.log(req.params.id.toString());
        await animalData.getAuth(req.params.id.toString());
    } catch(e){
        res.status(404).json({ message: "no animal with that id found!" });
        return;
    }
    try{
        postID = req.query.postId.toString();
        animalID = req.params.id.toString();
//        console.log("Before function");
        await animalData.deleteLike(animalID,postID);
//        console.log("Function executed");
        res.sendStatus(200);
    } catch (e){
        res.status(404).json({ message : "No success"});
        return;
    }
});

module.exports = router;
