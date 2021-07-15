'use strict';

class ModuleController
{
    constructor(repo, module)
    {
        this._broker = repo;

        // { name: "", title: "", description: "", binary: "", author: "", topic: "", version: ""}
        this._module = module;
    }

    get name()
    {
        return this._module.name;
    }
  
    get title()
    {
        return this._module.title;
    }
  
    get description()
    {
        return this._module.description;
    }

    get binary()
    {
        return this._module.binary;
    }

    get author()
    {
        return this._module.author;
    }

    get topic()
    {
        return this._module.topic;
    }

    get version()
    {
        return this._module.version;
    }

    get params()
    {
        return this._module.params;
    }

    get tags()
    {
        return this._module.tags;
    }

    persist()
    {
        throw new Error("Not Implemented");
    }

    remove()
    {
        throw new Error("Not Implemented");
    }

    present()
    {
        let result = {};

        if (this._module)
        {
            result = { 
                name: this._module.name,
                title: this._module.title,
                description: this._module.description,
                binary: this._module.binary,
                author: this._module.author,
                topic: this._module.topic,
                version: this._module.version,
                params: this._module.params,
                tags: this._module.tags
            };
        }
        return result;
    }
}

module.exports = ModuleController;