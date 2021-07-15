import { RedHerdObject } from './base/redherd-common';

export interface Topic extends RedHerdObject {
    name: string;
    description: string;
}