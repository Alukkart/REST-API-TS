"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.default)();
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;
;
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.users.findFirstOrThrow({
                where: {
                    email: email
                }
            });
            return (0, bcrypt_1.compare)(password, user.password).then(function (checkResult) {
                return checkResult;
            });
        }
        catch (e) { }
        ;
    });
}
;
function register(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = false;
        if (emailRegex.test(data.email) && passwordRegex.test(data.password)) {
            (0, bcrypt_1.genSalt)(10, function (err, salt) {
                (0, bcrypt_1.hash)(data.password, salt, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield prisma.users.create({
                                data: {
                                    email: data.email,
                                    password: hash
                                }
                            });
                            result = true;
                        }
                        catch (e) { }
                        ;
                    });
                });
            });
        }
        ;
        return result;
    });
}
;
router.post('/register', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        register({ email: req.body.email, password: req.body.password }).then((result) => {
            if (result) {
                res.status(200);
                res.cookie('jwt', (0, jsonwebtoken_1.sign)({ data: req.body.email }, 'secret', { expiresIn: '30d' }));
            }
            else {
                res.status(400);
            }
            ;
            res.send(result);
        });
    });
});
router.post('/login', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        login(req.body.email, req.body.password).then((result) => {
            if (result) {
                res.status(200);
                res.cookie('jwt', (0, jsonwebtoken_1.sign)({ data: req.body.email }, 'secret', { expiresIn: '30d' }));
            }
            else {
                res.status(400);
            }
            ;
            res.send(result);
        });
    });
});
exports.default = router;
