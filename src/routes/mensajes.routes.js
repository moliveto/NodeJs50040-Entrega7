import { Router } from "express";
import MessagesManager from "../dao/MessageManager.js";

const messages = new MessagesManager()
const router = Router()

router.get("/", (req, res) => {
    messages.getAllMessages().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
})

router.post("/", async (req, res) => {
    const user = req.body.user;
    const msge = req.body.message;
    messages.addMessage(user, msge).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
});

export default router;