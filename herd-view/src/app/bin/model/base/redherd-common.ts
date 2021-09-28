export enum RedHerdRootEndpoint {
    assets = 'assets',
    modules = 'modules',
    processes = 'processes',
    topics = 'topics',
    types = 'types',
    login = 'login',
    system = 'system'
}

export enum RedHerdEntity {
    asset = 'asset',
    assets = 'assets',
    module = 'module',
    modules = 'modules',
    process = 'process',
    processes = 'processes',
    topic = 'topic',
    topics = 'topics',
    type = 'type',
    types = 'types',
    instance = 'instance',
    instances = 'instances',
    ports = 'ports',
    result = 'result',
    service = 'service',
    token = 'token',
    system = 'system'
}

export interface RedHerdObject {
    id?: number;
}