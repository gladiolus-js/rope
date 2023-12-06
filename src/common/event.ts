import { RopeClientId } from "./client";

type RopeEventName = 'connect' | 'disconnect' | 'message'

/**
 * The target of a RopeEvent, which is either a client id or `null` for broadcast events
 */
type RopeEventTarget = RopeClientId | null

/**
 * An object that represents a RopeEvent
 */
type RopeEventObject<MessagePayload = unknown> = {
    evName: RopeEventName
    sender: RopeClientId
    target: RopeEventTarget
    message: MessagePayload
}

/**
 * Something converted from a RopeEvent.
 *
 * Aliased for semantic purposes, see {@link RopeEventObject} for the actual type
 */
type FromRopeEvent<T> = RopeEventObject<T>

/**
 * Something that can be converted to a RopeEvent.
 *
 * Aliased for semantic purposes, see {@link RopeEventObject} for the actual type
 */
type IntoRopeEvent<T> = RopeEventObject<T>

/**
 * The base class of all rope events.
 *
 * This is more for constraint purposes, as the actual events are implemented in the subclasses.
 */
abstract class RopeEvent<InnerMessage = unknown> {
    /**
     * The name of the event
     */
    protected readonly evName: RopeEventName
    /**
     * The id of the creator of the event
     */
    protected readonly sender: RopeClientId
    /**
     * The id of the target of the event, `null` if it is a broadcast event
     * @default null
     */
    protected readonly target: RopeEventTarget

    /**
     * The message in the event, `null` if there is no message
     * @default null
     */
    protected readonly message: InnerMessage

    protected constructor(evName: RopeEventName, sender: RopeClientId, target: RopeEventTarget, message: InnerMessage) {
        this.evName = evName
        this.sender = sender
        this.target = target
        this.message = message
    }

    /**
     * Create a RopeEvent from a json object
     */
    public static fromJson<InnerMessage>(_from: IntoRopeEvent<InnerMessage>): RopeEvent<InnerMessage> {
        // TODO: maybe use a factory pattern here?
        throw new Error("This method is abstract and should be implemented in the subclass.")
    }

    /**
     * Convert the RopeEvent to a json object
     */
    public toJson(): FromRopeEvent<InnerMessage> {
        return {
            evName: this.evName,
            sender: this.sender,
            target: this.target,
            message: this.message,
        }
    }
}

/**
 * Fired when a client has connected
 */
class REvConnect extends RopeEvent<null> {
    constructor(sender: RopeClientId) {
        super('connect', sender, null, null)
    }
}

/**
 * Fired when a client has disconnected
 */
class REvDisconnect extends RopeEvent<null> {
    constructor(sender: RopeClientId) {
        super('disconnect', sender, null, null)
    }
}

/**
 * Fired when a client has sent a message
 */
class REvMessage<InnerMessage = unknown> extends RopeEvent<InnerMessage> {
    constructor(sender: RopeClientId, message: InnerMessage, target: RopeEventTarget = null) {
        super('message', sender, target, message)
    }
}

export type {
    RopeEventName,
    FromRopeEvent,
    IntoRopeEvent,
}

export {
    RopeEvent,
    REvConnect,
    REvDisconnect,
    REvMessage,
}
