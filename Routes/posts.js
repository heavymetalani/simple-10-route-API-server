const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;

router.get("/", async (req,res)=>{
    try{
        const posts = await postData.getAll();
        res.json(posts);
    } catch (e){
        res.status(404).json({message: "Posts not found"});
    }
});


router.get("/:id", async (req, res) => {
    try {
      const post = await postData.get(req.params.id);
      res.json(post);
    } catch (e) {
      res.status(404).json({ message: "not found!" });
    }
  });
  

  router.post("/", async (req, res) => {
  const postInfo = req.body;

  if (!postInfo) {
    res.status(400).json({ error: "You must provide data to create a post" });
    return;
  }

  if (!postInfo.title) {
    res.status(400).json({ error: "You must provide a title" });
    return;
  }

  if (!postInfo.author) {
    res.status(400).json({ error: "You must provide an author" });
    return;
  }

  if (!postInfo.content) {
    res.status(400).json({ error: "You must provide content" });
    return;
  }

  try {
    const newPost = await postData.create(
      postInfo.title,
      postInfo.author,
      postInfo.content
    );
    res.json(newPost);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
    const postInfo = req.body;
  
    if (!postInfo) {
      res.status(400).json({ error: "You must provide data to update a post" });
      return;
    }
  
    if (!postInfo.newTitle) {
      res.status(400).json({ error: "You must provide a new title" });
      return;
    }
  
    if (!postInfo.newContent) {
      res.status(400).json({ error: "You must provide new content" });
      return;
    }
  
    try {
      await postData.get(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
  
    try {
      const updatedPost = await postData.rename(req.params.id, postInfo.newTitle, postInfo.newContent);
      res.json(updatedPost);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await postData.get(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
  
    try {
      const deletedPost = await postData.remove(req.params.id);
      res.json(deletedPost);
    } catch (e) {
      res.sendStatus(500);
      return;
    }
  });

module.exports = router;