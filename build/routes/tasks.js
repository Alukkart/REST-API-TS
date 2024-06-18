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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
function addTask(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.jwt == undefined) {
            return false;
        }
        ;
        let result = false;
        const jwt = (0, jsonwebtoken_1.verify)(req.cookies.jwt, 'secret');
        try {
            yield prisma.tasks.create({
                data: {
                    user_id: (yield prisma.users.findFirstOrThrow({
                        where: {
                            email: jwt.data
                        },
                        select: {
                            id: true
                        }
                    })).id,
                    title: req.body.title,
                    description: req.body.description,
                }
            });
            result = true;
        }
        catch (e) { }
        ;
        return result;
    });
}
router.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        addTask(req).then((result) => {
            if (result) {
                res.status(200);
            }
            else {
                res.status(400);
            }
            ;
            res.send(result);
        });
    });
});
function getAllTasks(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.jwt == undefined) {
            return false;
        }
        ;
        let result = false;
        const jwt = (0, jsonwebtoken_1.verify)(req.cookies.jwt, 'secret');
        try {
            return yield prisma.tasks.findMany({
                where: {
                    user_id: (yield prisma.users.findFirstOrThrow({
                        where: {
                            email: jwt.data
                        },
                        select: {
                            id: true
                        }
                    })).id
                }
            });
        }
        catch (_a) { }
        ;
        return result;
    });
}
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        getAllTasks(req).then((result) => {
            if (result) {
                res.status(200);
            }
            else {
                res.status(400);
            }
            ;
            res.send(result);
        });
    });
});
function getTask(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.jwt == undefined) {
            return false;
        }
        ;
        const jwt = (0, jsonwebtoken_1.verify)(req.cookies.jwt, 'secret');
        let result;
        try {
            return yield prisma.tasks.findFirstOrThrow({
                where: {
                    id: Number(req.params.id)
                }
            });
        }
        catch (e) {
            console.log(e);
        }
        ;
        return result;
    });
}
router.get('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        getTask(req).then((result) => {
            if (result) {
                res.status(200);
            }
            else {
                res.status(400);
            }
            ;
            res.send(result);
        });
    });
});
function updateTask(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.jwt == undefined) {
            return false;
        }
        ;
        let result = false;
        const jwt = (0, jsonwebtoken_1.verify)(req.cookies.jwt, 'secret');
        try {
            yield prisma.tasks.update({
                where: {
                    user_id: (yield prisma.users.findFirstOrThrow({
                        where: {
                            email: jwt.data
                        },
                        select: {
                            id: true
                        }
                    })).id,
                    id: Number(req.params.id)
                },
                data: {
                    user_id: (yield prisma.users.findFirstOrThrow({
                        where: {
                            email: jwt.data
                        },
                        select: {
                            id: true
                        }
                    })).id,
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status
                }
            });
            result = true;
        }
        catch (e) { }
        ;
        return result;
    });
}
router.put('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        updateTask(req).then((result) => {
            if (result) {
                res.status(200);
            }
            else {
                res.status(400);
            }
            ;
            res.send(result);
        });
    });
});
function deleteTask(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.jwt == undefined) {
            return false;
        }
        ;
        let result = false;
        const jwt = (0, jsonwebtoken_1.verify)(req.cookies.jwt, 'secret');
        try {
            yield prisma.tasks.delete({
                where: {
                    user_id: (yield prisma.users.findFirstOrThrow({
                        where: {
                            email: jwt.data,
                            id: req.body.task_id
                        },
                        select: {
                            id: true
                        }
                    })).id,
                    id: Number(req.params.id)
                }
            });
            result = true;
        }
        catch (_a) { }
        ;
        return result;
    });
}
router.delete('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        deleteTask(req).then((result) => {
            if (result) {
                res.status(200);
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
