'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const Config = require('../../config');

class JWTProvider
{
    static verifyToken(token)
    {
        let result = false;
        try
        {
            let cert = fs.readFileSync(Config.api_jwt_cert_path);

            //  jwt.verify()
            // ************************************************************
            //  Returns the payload decoded if the signature is valid and
            //  optional expiration, audience, or issuer are valid. If not,
            //  it will throw the error.
            //
            //  Ref: https://www.npmjs.com/package/jsonwebtoken
            // ************************************************************
            jwt.verify(token, cert);

            //  If the following statement is executed the token is valid
            // ************************************************************
            result = true;
        }
        catch
        {
            //  If the token is not valid the exception raised by the verify
            //  function is catched here
            // ************************************************************
            result = false;
        }
        return result;
    }

    static generateToken(data)
    {
        let result = false;
        try
        {
            let privateKey = fs.readFileSync(Config.api_jwt_key_path);

            //  JWT token generation
            // ************************************************************
            result = jwt.sign(data, privateKey, { algorithm: 'RS256', expiresIn: Config.api_jwt_expiration_time });
        }
        catch
        {
            result = '';
        }
        return result;
    }
}

module.exports = JWTProvider;