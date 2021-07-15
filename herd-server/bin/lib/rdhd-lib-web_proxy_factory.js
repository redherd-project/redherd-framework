'use strict';

const fs = require('fs');
const express = require('express');
const ratelimiter = require('express-rate-limit');
const proxy = require('http-proxy-middleware');
const ServiceFinalizer = require('./base/rdhd-lib-service_finalizer');
const AuthController = require('../../controllers/rdhd-ctr-authentication_controller');

class WebProxyFactory
{
    static spawn(port, targetHost, targetPort, key = '', cert = '', ca = '', auth = false, ssl = false, targetOverSsl = false, endPoint = '/', debug = false, rateLimitWindow = 60000, rateLimitCount = 100)
    {
        let result = true;
        try
        {
            let http = ssl ? require('https') : require('http');
            let target = (targetOverSsl ? 'https' : 'http') + '://' + targetHost + ':' + targetPort;
            let app = express();
            let ignoreCertsErrors = debug ? false : true;
            let limiter = ratelimiter({ windowMs: rateLimitWindow,  max: rateLimitCount, message: '429 - Too Many Requests' });

            if (auth)
            {
                app.route(endPoint)
                    .all(AuthController.authenticationMiddleware, (req, res, next) => { next();})
            }
        
            let proxyOptions = proxy.createProxyMiddleware({
                target: target,
                changeOrigin: true,
                secure: ignoreCertsErrors,
                onError: (err, req, res) => {
                    res.end('500 - Server Error');
                }
            });
        
            app.use(endPoint, limiter);
            app.use(endPoint, proxyOptions);

            let serverOptions = ssl ? {
                key: fs.readFileSync(key),
                cert: fs.readFileSync(cert),
                ca: fs.readFileSync(ca),
                rejectUnauthorized: false,
                secure: ignoreCertsErrors
            } : {};
        
            let server = http.createServer(serverOptions, app);
            server.listen(port);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }

    static destroy(port)
    {
        return ServiceFinalizer.destroy(port);
    }
}

module.exports = WebProxyFactory;