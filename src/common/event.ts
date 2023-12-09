import { RopeClientId, RopeClientStrategy, RopeEventTarget } from "./client";

/**
 * Note: some of the types are one-way, meaning that they are only used in one direction.
 * - 'creation' is used to notify the worker that a client has been created.
 * - 'rejection' is used to notify the client that the worker has rejected the client.
 */
type RopeEventName = 'message' | 'creation' | 'rejection' | 'stat'

/**
 * An object that represents a RopeEvent
 *
 * consider `FromRopeEvent` / `IntoRopeEvent` for semantic usage
 */
type RopeEventObject<MessagePayload = unknown> = {
    evName: RopeEventName
    sender: RopeClientId
    receiver: RopeEventTarget
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
     * The id of the receiver of the event, `null` if it is a broadcast event
     * @default null
     */
    public readonly receiver: RopeEventTarget

    /**
     * The message in the event, `null` if there is no message
     * @default null
     */
    public readonly message: InnerMessage

    protected constructor(evName: RopeEventName, sender: RopeClientId, receiver: RopeEventTarget, message: InnerMessage) {
        this.evName = evName
        this.sender = sender
        this.receiver = receiver
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
            receiver: this.receiver,
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
    constructor(sender: RopeClientId, message: InnerMessage, receiver: RopeEventTarget = null) {
        super('message', sender, receiver, message)
    }
}

/**
 * Represents a client has been created
 *
 * ---
 * This is used to notify the worker that a client has been created.
 */
class RevCreation extends RopeEvent<RopeClientStrategy> {
    constructor(sender: RopeClientId, strategy: RopeClientStrategy) {
        super('creation', sender, null, strategy)
    }
}

/**
 * Represents a stat request
 */
class RevStat extends RopeEvent<null> {
    constructor(sender: RopeClientId) {
        super('stat', sender, null, null)
    }
}

export type {
    RopeEventName,
    RopeEventObject,
    FromRopeEvent,
    IntoRopeEvent,
}

export {
    RopeEvent,
    REvMessage,
    RevCreation,
    RevStat,
}
