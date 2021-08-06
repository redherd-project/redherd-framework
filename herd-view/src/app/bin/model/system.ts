import { RedHerdObject } from './base/redherd-common';

export interface System extends RedHerdObject {
    seed: string;
    dob: string;
}