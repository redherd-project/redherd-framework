'use strict';

const killPort = require('kill-port');

class ServiceFinalizer
{
    static destroy(port, transport = 'tcp')
    {
        let result = true;
        try
        {
            setTimeout(() => {
                killPort(port, transport)
                    .then(console.log)
                    .catch(console.log)
            }, 500);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = ServiceFinalizer;