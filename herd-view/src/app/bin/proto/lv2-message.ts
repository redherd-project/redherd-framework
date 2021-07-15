import { Lv1Message } from "./lv1-message"

export interface Lv2Message {
    src: string;
    dst: string;
    type: string;
    session: string;
    payload: Lv1Message    
}