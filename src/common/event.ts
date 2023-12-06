import { RopeClientId, RopeEventTarget } from "./client";

type RopeEventName = 'message'

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
    public readonly evName: RopeEventName
    /**
     * The id of the creator of the event
     */
    public readonly sender: RopeClientId
    /**
     * The id of the target of the event, `null` if it is a broadcast event
     * @default null
     */
    public readonly target: RopeEventTarget

    /**
     * The message in the event, `null` if there is no message
     * @default null
     */
    public readonly message: InnerMessage

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

// ========== ========== ↑  Declarations  ↑ ========== ==========
// ========== ========== ↓ Implementations ↓ ========== ==========

/**
 * Represents a message packet
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
    REvMessage,
}