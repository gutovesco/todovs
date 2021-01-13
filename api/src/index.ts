import 'reflect-metadata';
import express from "express";
import {createConnection} from 'typeorm';
import { __prod__ } from './constants';
import { join } from 'path';

(async () => {
    try{
        await createConnection({
            type: 'postgres',
            database: 'postgres',
            entities: [join(__dirname, './entities/*.*')],
            logging: !__prod__,
            synchronize: !__prod__,
            port: 5666,
            username: 'postgres',
            password: 'guto12+34'
        });
    } catch(err){
        console.log(err);
    }

    const app = express();
    app.listen(3002, () => {
        app.get('/', (_, res) => {
            res.send("hello");
        });
        console.log('listening on 3002!');
        console.log('dawdwadwda');
    });
})();