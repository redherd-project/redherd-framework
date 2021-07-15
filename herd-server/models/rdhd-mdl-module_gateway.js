'use strict';

const fs = require('fs');
const path = require('path');

class ModuleGateway
{
    constructor(repo)
    {
        this.repo = repo;
    }

    // Specialized decorator
    findByName(name)
    {
        let current = false;
        fs.readdirSync(this.repo).forEach(f => {
            if (path.extname(f).toUpperCase() == ".INFO")
            {
                let jdata = JSON.parse(fs.readFileSync(path.join(this.repo, f)));
                if (jdata.name.toUpperCase() == name.toUpperCase())
                {
                    current = jdata;
                }
            }
        });

        return current;
    }

    // Specialized decorator
    findByTopic(topic)
    {
        let modules = [];
        fs.readdirSync(this.repo).forEach(f => {
            if (path.extname(f).toUpperCase() == ".INFO")
            {
                let current = JSON.parse(fs.readFileSync(path.join(this.repo, f)));
                if (current.topic.toUpperCase() == topic.toUpperCase())
                {
                    modules.push(current);
                }
            }
        });

        return modules;
    }

    // Specialized decorator
    findAll()
    {
        let modules = [];
        fs.readdirSync(this.repo).forEach(f => {
            if (path.extname(f).toUpperCase() == ".INFO")
            {
                modules.push(JSON.parse(fs.readFileSync(path.join(this.repo, f))));
            }
        });

        return modules;
    }
}

module.exports = ModuleGateway;