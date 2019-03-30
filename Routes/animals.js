const express = require("express");
const router = express.Router();
const data = require("../data");
const animalData = data.animals;

router.get("/", async (req,res)=>{
    try{
        const animals = await animalData.getAll();
        res.json(animals);
    } catch (e){
        res.status(404).json({message: "Animals not found"});
    }
});


router.get("/:id", async (req, res) => {
    try {
      const animal = await animalData.get(req.params.id);
      res.json(animal);
    } catch (e) {
      res.status(404).json({ message: "not found!" });
    }
  });
  

  router.post("/", async (req, res) => {
  const animalInfo = req.body;

  if (!animalInfo) {
    res.status(400).json({ error: "You must provide data to create an animal" });
    return;
  }

  if (!animalInfo.name) {
    res.status(400).json({ error: "You must provide a name" });
    return;
  }

  if (!animalInfo.animalType) {
    res.status(400).json({ error: "You must provide animal type" });
    return;
  }

  try {
    const newAnimal = await animalData.create(
      animalInfo.name,
      animalInfo.animalType,
      []
    );
    res.json(newAnimal);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
    const animalInfo = req.body;
  
    if (!animalInfo) {
      res.status(400).json({ error: "You must provide data to update an animal" });
      return;
    }
  
    if (!animalInfo.newName) {
      res.status(400).json({ error: "You must provide a new name" });
      return;
    }
  
    if (!animalInfo.newType) {
      res.status(400).json({ error: "You must provide a new type" });
      return;
    }
  
    try {
      await animalData.get(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "Animal not found" });
      return;
    }
  
    try {
      const updatedAnimal = await animalData.rename(req.params.id, animalInfo.newName, animalInfo.newType);
      res.json(updatedAnimal);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await animalData.get(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "Animal not found" });
      return;
    }
  
    try {
      const deletedAnimal = await animalData.remove(req.params.id);
      res.json(deletedAnimal);
    } catch (e) {
      res.sendStatus(500);
      return;
    }
  });

module.exports = router;