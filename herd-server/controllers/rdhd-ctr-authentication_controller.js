'use strict';

const bcrypt = require('bcrypt');

const ModelController = require('./rdhd-ctr-model_controller');
const JWTProvider = require('../bin/lib/rdhd-lib-jwt_provider');

const model = new ModelController();
const urlKey = 't';

class AuthenticationController
{
    static authenticate(username, password)
    {
        let result = '';
        try
        {
            let users = model.getEnabledUsers();
            let user = users.find(u => u.uname == username);

            if (user && bcrypt.compareSync(password, user.secret))
            {
                result = JWTProvider.generateToken({ user: username });
            }
        }
        catch
        {
            result = '';
        }
        return result;
    }

    static isAuthenticated(token)
    {
        let result = false;
        try
        {
            result = JWTProvider.verifyToken(token);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }

    static authenticationMiddleware(req, res, next)
    {
        if ((req.query) && (req.query[urlKey]))
        {
            if (AuthenticationController.isAuthenticated(req.query[urlKey]))
            {
                next();
            }
            else
            {
                res.type('text/plain');
                res.status(403);
                res.send('403 - Forbidden');
            }
        }
        else
        {
            res.type('text/plain');
            res.status(401);
            res.send('401 - Unauthorized');
        }
    }
}

module.exports = AuthenticationController;