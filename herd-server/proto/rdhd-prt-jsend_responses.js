'use strict';

class JSendResponses
{
    //  JSend spec compliant responses generator
    //
    //  Ref: https://github.com/omniti-labs/jsend
    // ******************************
    static success(data)
    {
        let response = {
            status : "success",
            data : data
        };

        return response;
    }

    static fail(data)
    {
        let response = {
            status : "fail",
            data : data
        };

        return response;
    }

    static error(message, code = null, data = null)
    {
        let response = {
            status : "error",
            message : message,
        };

        if (code)
        {
            response.code = code;
        }

        if (data)
        {
            response.data = data;
        }
        return response;
    }
}

module.exports = JSendResponses