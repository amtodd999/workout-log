const Express = require("express");
const router = Express.Router();
const validateJWT = require("../middleware/validate-jwt");

//Import the log model
const { LogModel } = require("../models");

router.get("/practice", validateJWT, (req, res) => {
    res.send("this is practice")
});

//Workout Log Create
router.post("/", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//Get ALL workout logs by user
router.get("/", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//Update a log

router.put(("/:id"), validateJWT, async (req, res) => {
    const { id } = req.params;
    const { description, definition, result } = req.body.log;
    const userId = req.user.id;
    const query = {
        where: {
            id: id,
            owner_id: userId
        }
    };
    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//Get individual log by user
router.get(("/:id"), validateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const userLog = await LogModel.findOne({
            where: {
                owner_id: req.user.id,
                id: id
            }
        });
        res.status(200).json(userLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//Deleting a log
router.delete(("/:id"), validateJWT, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    try {
        const query = {
            where: {
                id: id,
                owner_id: userId
            }
        };
        await LogModel.destroy(query);
        res.status(200).json({ message: "Log removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }    
});

module.exports = router;