export enum RedHerdRootEndpoint {
    assets = 'assets',
    modules = 'modules',
    processes = 'processes',
    topics = 'topics',
    types = 'types',
    login = 'login'
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
    ports = 'ports',
    result = 'result',
    service = 'service',
    token = 'token'
}

export interface RedHerdObject {
    id?: number;
}