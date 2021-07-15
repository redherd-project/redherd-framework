import { RedHerdObject } from './base/redherd-common';
import { Type } from './type';

export interface Asset extends RedHerdObject {
    name: string;
    ip: string;
    description: string;
    user: string;
    fingerprint: string;
    wport: number;
    joined: number;
    type: Type;
}