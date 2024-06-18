import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import logger from 'morgan';

const app: Express = express(), port = 8888;

import auth from './routes/auth';
import tasks from './routes/tasks';

// view engine setup
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', auth);
app.use('/tasks', tasks);

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: (arg0: createError.HttpError<404>) => void) {
    next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response) {
    res.status(err.status || 500);
    res.json({error: err.status, message:err.message});
});

app.listen(port, () => {
    console.log('server running at http://localhost:%s', port);
});
