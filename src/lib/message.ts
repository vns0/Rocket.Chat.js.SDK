// message.ts
import { IMessage, IMessageOpts } from '../config/messageInterfaces'

// Message class declaration implicitly implements interface
// https://github.com/Microsoft/TypeScript/issues/340
export interface Message extends IMessage {}

/**
 * Rocket.Chat message class.
 * Sets integration param to allow tracing the source of automated sends.
 * @param content Accepts message text or a preformed message object.
 * @todo Potential for SDK usage that isn't bots; bot property should be optional?
 */
export class Message implements IMessage {
  // The IMessage interface allows many fields to be optional.
  // We explicitly define the ones we use here.
  rid: string | null = null
  msg?: string
  // `bot` can be a boolean or an object, depending on the mode.
  bot?: boolean | { i: string }

  constructor (
    content: string | IMessage,
    integrationId: string,
    opts: IMessageOpts = {}
  ) {
    if (typeof content === 'string') {
      this.msg = content
    } else {
      // Copy all fields from the content object
      Object.assign(this, content)
    }

    // If useLegacyBotFormat is true, set bot to { i: integrationId }
    // Otherwise, set bot to true
    if (opts.useLegacyBotFormat) {
      this.bot = { i: integrationId }
    } else {
      this.bot = true
    }
  }

  setRoomId (roomId: string): Message {
    this.rid = roomId
    return this
  }
}
