import { Router, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

interface IJwtPayload {
    data: string
}

async function addTask(req:Request) {
    if(req.cookies.jwt == undefined){return false};

    let result = false;
    const jwt = verify(req.cookies.jwt, 'secret') as IJwtPayload;

    try{
        await prisma.tasks.create({
            data: {
                user_id: (await prisma.users.findFirstOrThrow({
                    where: {
                        email: jwt.data
                    },
                    select:{
                        id: true
                    }
                })).id,
                title: req.body.title,
                description: req.body.description,
            }
        });
        result = true
    }catch(e){};
    return result;
}

router.post('/', async function(req, res){
    addTask(req).then((result) => {
        if(result){res.status(200)}else{res.status(400)};
        res.send(result);
    })
});

async function getAllTasks(req:Request) {
    if(req.cookies.jwt == undefined){return false};

    let result = false;
    const jwt = verify(req.cookies.jwt, 'secret') as IJwtPayload;

    try{
        return await prisma.tasks.findMany({
            where:{
                user_id:(await prisma.users.findFirstOrThrow({
                    where: {
                        email: jwt.data
                    },
                    select:{
                        id: true
                    }
                })).id
            }
        });

    }catch{};
    return result
}

router.get('/', async function(req, res){
    getAllTasks(req).then((result) => {
        if(result){res.status(200)}else{res.status(400)};
        res.send(result);
    });
});

async function getTask(req:Request) {
    if(req.cookies.jwt == undefined){return false};

    const jwt = verify(req.cookies.jwt, 'secret') as IJwtPayload;
    let result;

    try{
        return await prisma.tasks.findFirstOrThrow({
            where:{
                user_id:(await prisma.users.findFirstOrThrow({
                    where: {
                        email: jwt.data
                    },
                    select:{
                        id: true
                    }
                })).id,
                id: Number(req.params.id)
            }
        });
    }catch(e){console.log(e)};
    return result
}

router.get('/:id', async function(req, res){
    getTask(req).then((result) => {
        if(result){res.status(200)}else{res.status(400)};
        res.send(result);
    });
});

async function updateTask(req:Request) {
    if(req.cookies.jwt == undefined){return false};
    let result = false;
    const jwt = verify(req.cookies.jwt, 'secret') as IJwtPayload;

    try{
        await prisma.tasks.update({
            where:{
                user_id:(await prisma.users.findFirstOrThrow({
                    where: {
                        email: jwt.data
                    },
                    select:{
                        id: true
                    }
                })).id,
                id: Number(req.params.id)
            },
            data:{
                user_id:(await prisma.users.findFirstOrThrow({
                    where: {
                        email: jwt.data
                    },
                    select:{
                        id: true
                    }
                })).id,
                title: req.body.title,
                description: req.body.description,
                status: req.body.status
            }
        });
        result = true;
    }catch(e){};
    return result
}

router.put('/:id', async function(req, res){
        updateTask(req).then((result) => {
        if(result){res.status(200)}else{res.status(400)};
        res.send(result);
    });
});

async function deleteTask(req:Request) {
    if(req.cookies.jwt == undefined){return false};

    let result = false;
    const jwt = verify(req.cookies.jwt, 'secret') as IJwtPayload;

    try{
        await prisma.tasks.delete({
            where:{
                user_id:(await prisma.users.findFirstOrThrow({
                    where: {
                        email: jwt.data,
                        id: req.body.task_id
                    },
                    select:{
                        id: true
                    }
                })).id,
                id: Number(req.params.id)
            }
        });
        result = true;
    }catch{};
    return result
}

router.delete('/:id', async function(req, res){
    deleteTask(req).then((result) => {
        if(result){res.status(200)}else{res.status(400)};
        res.send(result);
    });
});

export default router;
