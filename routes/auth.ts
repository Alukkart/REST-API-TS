import Router from 'express';
import { sign } from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;

interface Iuser{
    email: string
    password: string
};

async function login(email:string, password:string) {
    try{
        const user = await prisma.users.findFirstOrThrow({
            where: {
                email: email
            }
        })
        return compare(password, user.password).then(function(checkResult) {
            return checkResult
        });
    }catch(e){};
};

async function register(data:Iuser) {
    let result = false;
    if(emailRegex.test(data.email) && passwordRegex.test(data.password)){
        genSalt(10, function(err, salt) {
            hash(data.password, salt, async function(err, hash) {
                try{
                    await prisma.users.create({
                        data:{
                            email: data.email,
                            password: hash
                        }
                    });
                    result = true;
                }catch(e){};
            });
        });
    };
    return result;
};

router.post('/register', async function(req, res){
    register({email: req.body.email, password: req.body.password}).then((result) => {
        if(result){
            res.status(200);
            res.cookie('jwt', sign({data: req.body.email}, 'secret', { expiresIn: '30d' }));
        }else{res.status(400)};
        res.send(result);
    });
});



router.post('/login', async function(req, res){
    login(req.body.email, req.body.password).then((result) => {
        if(result){
            res.status(200);
            res.cookie('jwt', sign({data: req.body.email}, 'secret', { expiresIn: '30d' }));
        }else{res.status(400)};
        res.send(result);
    });
});

export default router;

