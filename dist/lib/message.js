"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Rocket.Chat message class.
 * Sets integration param to allow tracing the source of automated sends.
 * @param content Accepts message text or a preformed message object.
 * @todo Potential for SDK usage that isn't bots; bot property should be optional?
 */
class Message {
    constructor(content, integrationId, opts = {}) {
        // The IMessage interface allows many fields to be optional.
        // We explicitly define the ones we use here.
        this.rid = null;
        if (typeof content === 'string') {
            this.msg = content;
        }
        else {
            // Copy all fields from the content object
            Object.assign(this, content);
        }
        // If useLegacyBotFormat is true, set bot to { i: integrationId }
        // Otherwise, set bot to true
        if (opts.useLegacyBotFormat) {
            this.bot = { i: integrationId };
        }
        else {
            this.bot = true;
        }
    }
    setRoomId(roomId) {
        this.rid = roomId;
        return this;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map