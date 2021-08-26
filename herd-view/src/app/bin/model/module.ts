import { RedHerdObject } from './base/redherd-common';

export enum ModuleMode {
    automatic = 'automatic',
    interactive = 'interactive',
    pivotable = 'pivotable'
}

export enum ModuleVerb {
    execute = 'execute',
    interact = 'interact',
    pivot = 'pivot',
    configure = 'configure',
    resume = 'resume',
    none = ''
}

export interface Module extends RedHerdObject {
    name: string;
    title: string;
    description: string;
    binary: string;
    author: string;
    topic: string;
    version: string;
    params: ModuleParam[];
    tags: string[];
}

export interface ModuleParam {
    label: string;
    name: string;
    type: string;
    values?: string[];
}

export interface ModuleInstance {
    session: string;
    result?: {};
}