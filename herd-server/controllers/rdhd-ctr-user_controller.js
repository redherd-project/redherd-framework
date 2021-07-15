'use strict';

const bcrypt = require('bcrypt');
const uMapper = require('../models/rdhd-mdl-user_mapper');

class UserController
{
    constructor(broker, user)
    {
        this._broker = broker;

        // { id: 0, uname: "", secret: "", enabled: "" }
        this._user = user;
    }
    
    get id()
    {
        return this._user.id;
    }

    get uname()
    {
        return this._user.uname;
    }
  
    set uname(value)
    {
        this._user.uname = value;
    }

    get secret()
    {
        return this._user.secret;
    }
    
    set secret(value)
    {
        this._user.secret = value;
    }

    get enabled()
    {
        return this._user.enabled;
    }
    
    set enabled(value)
    {
        this._user.enabled = value;
    }

    persist()
    {
        let result;
        let u = new uMapper(this._broker);

        if (this._user.id)
        {
            if (this._user.secret)
            {
                this._user.secret = bcrypt.hashSync(this._user.secret, bcrypt.genSaltSync(10));
            }
            result = (u.update(this._user) == 0) ? true : false;
        }
        else
        {
            this._user.secret = bcrypt.hashSync(this._user.secret, bcrypt.genSaltSync(10));

            result = (u.insert(this._user) > 0) ? true : false;
        }
        return result;
    }

    remove()
    {
        let result = false;
        let u = new uMapper(this._broker);

        if (this._user.id)
        {
            result = (u.deleteById(this._user.id) == 0) ? true : false;
        }
        return result;
    }

    present()
    {
        let result = {};

        if (this._user)
        {
            result = { id: this._user.id, uname: this._user.uname, enabled: this._user.enabled };
        }
        return result;
    }
}

module.exports = UserController;