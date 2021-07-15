import { RedHerdObject } from './base/redherd-common';

export interface Process extends RedHerdObject {
    module: string;
    session: string;
    id_asset: number;
}