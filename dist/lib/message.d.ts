import { IMessage, IMessageOpts } from '../config/messageInterfaces';
export interface Message extends IMessage {
}
/**
 * Rocket.Chat message class.
 * Sets integration param to allow tracing the source of automated sends.
 * @param content Accepts message text or a preformed message object.
 * @todo Potential for SDK usage that isn't bots; bot property should be optional?
 */
export declare class Message implements IMessage {
    rid: string | null;
    msg?: string;
    bot?: boolean | {
        i: string;
    };
    constructor(content: string | IMessage, integrationId: string, opts?: IMessageOpts);
    setRoomId(roomId: string): Message;
}
