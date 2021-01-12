import express from "express";

(async () => {
    const app = express();
    app.listen(3002, () => {
        app.get('/', (_, res) => {
            res.send("hello")
        })
        console.log('listening on 3002!');
    })
})();