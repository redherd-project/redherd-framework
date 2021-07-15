'use strict';

const Config = require('../config');
const Utils = require('../bin/lib/rdhd-lib-common_utils');
const ApiController = require('../controllers/rdhd-ctr-api_controller');
const AuthController = require('../controllers/rdhd-ctr-authentication_controller');

module.exports = (app) => {

    try
    {
        // ************************************************************
        //  Securing routes if needed
        // ************************************************************
        const securedRoutes = Config.api_secured_routes;
        const routeAuthenticationMiddleware = Config.api_auth_enabled ?
            (req, res, next) => {
                if (Utils.isSecuredRoute(req.path, securedRoutes))
                {
                    AuthController.authenticationMiddleware(req, res, next);
                }
                else
                {
                    next();
                }
            } : (req, res, next) => next();

        // ************************************************************
        //  Defining routes
        // ************************************************************
        app.route(Config.api_endpoint + '/login')
            .post((req, res) => { res.json(ApiController.authenticateUserApi(req.body)); });

        app.route(Config.api_endpoint + '/assets')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getAssetsApi()); })
            .post(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.addAssetApi(req.body)); });

        app.route(Config.api_endpoint + '/assets/:param')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getAssetApi(req.params.param)); })
            .put(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.updateAssetApi(req.params.param, req.body)); })
            .delete(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.removeAssetApi(req.params.param)); });

        app.route(Config.api_endpoint + '/assets/:id/service')
            .post(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.runAssetServiceApi(req.params.id, req.body)); });

        app.route(Config.api_endpoint + '/assets/:id/topics')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getTopicsByAssetIdApi(req.params.id)); })
            .put(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.addTopicToAssetApi(req.params.id, req.body)); });

        app.route(Config.api_endpoint + '/assets/:id/topics/:topicId')
            .delete(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.removeTopicFromAssetApi(req.params.id, req.params.topicId)); });

        app.route(Config.api_endpoint + '/assets/:id/modules')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getModulesByAssetIdApi(req.params.id)); });

        app.route(Config.api_endpoint + '/assets/:id/modules/:name/run')
            .post(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.runModuleApi(req.params.id, req.params.name, req.body, req.query ? req.query['t'] : '')); });

        app.route(Config.api_endpoint + '/assets/:id/processes')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getProcessesByAssetIdApi(req.params.id)); })

        app.route(Config.api_endpoint + '/modules')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getModulesApi()); });

        app.route(Config.api_endpoint + '/modules/:name')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getModuleByNameApi(req.params.name)); });

        app.route(Config.api_endpoint + '/topics')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getTopicsApi()); })
            .post(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.addTopicApi(req.body)); });

        app.route(Config.api_endpoint + '/topics/:param')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getTopicApi(req.params.param)); })
            .put(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.updateTopicApi(req.params.param, req.body)); })
            .delete(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.removeTopicApi(req.params.param)); });

        app.route(Config.api_endpoint + '/topics/:param/assets')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getAssetsByTopicApi(req.params.param)); });

        app.route(Config.api_endpoint + '/processes')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getProcessesApi()); });

        app.route(Config.api_endpoint + '/processes/:id')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getProcessByIdApi(req.params.id)); })
            .delete(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.killProcessApi(req.params.id)); });

        app.route(Config.api_endpoint + '/types')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getTypesApi()); })
            .post(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.addTypeApi(req.body)); });

        app.route(Config.api_endpoint + '/types/:param')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getTypeApi(req.params.param)); })
            .put(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.updateTypeApi(req.params.param, req.body)); })
            .delete(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.removeTypeApi(req.params.param)); });

        app.route(Config.api_endpoint + '/users')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getUsersApi()); })
            .post(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.addUserApi(req.body)); });

        app.route(Config.api_endpoint + '/users/:param')
            .get(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.getUserApi(req.params.param)); })
            .put(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.updateUserApi(req.params.param, req.body)); })
            .delete(routeAuthenticationMiddleware, (req, res) => { res.json(ApiController.removeUserApi(req.params.param)); });
    }
    catch (e)   
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
    }
}