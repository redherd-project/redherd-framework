'use strict';

class DataGateway
{
    constructor(connectionBroker, entity)
    {
        // !--!
        this.broker = connectionBroker.connect();
        this.entity = entity;
    }

    // Concrete method
    do(toDo)
    {
        return toDo();
    }

    // Query decorator
    select(stmt, params)
    {
        return this.do(() => { return this.broker.run(stmt, params); });
    }

    // DML insert decorator
    insert(tuple)
    {
        return this.do(() => { return this.broker.insert(this.entity, tuple); });
    }

    // DML delete decorator
    delete(tuple, where = null)
    {
        let result = -1;
        if (where)
        {
            result = this.do(() => { return this.broker.delete(this.entity, where); });
        }
        else
        {
            result = this.do(() => { return this.broker.delete(this.entity, { id: tuple.id }); });
        }
        return result;
    }

    // DML update decorator
    update(tuple, where = null)
    {
        let result = -1;
        if (where)
        {
            result = this.do(() => { return this.broker.update(this.entity, tuple, where); });
        }
        else
        {
            result = this.do(() => { return this.broker.update(this.entity, tuple, { id: tuple.id }); });
        }
        return result;
    }
}

module.exports = DataGateway;