type RopeEventName = 'connect' | 'disconnect' | 'message'

/**
 * An object that represents a RopeEvent
 */
type RopeEventObject<MessagePayload = unknown> = {
    evName: RopeEventName
    causer: string
    receiver: string | null
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
    abstract readonly evName: RopeEventName
    /**
     * The id of the creator of the event
     */
    abstract readonly causer: string
    /**
     * The id of the receiver of the event, `null` if it is a broadcast event
     */
    abstract readonly receiver: string | null

    /**
     * The message in the event, `null` if there is no message
     */
    abstract readonly message: InnerMessage

    /**
     * Create a RopeEvent from a json object
     */
    static fromJson<InnerMessage>(_from: IntoRopeEvent<InnerMessage>): RopeEvent<InnerMessage> {
        // TODO: maybe use a factory pattern here?
        throw new Error("This method is abstract and should be implemented in the subclass.")
    }

    /**
     * Convert the RopeEvent to a json object
     */
    toJson(): FromRopeEvent<InnerMessage> {
        return {
            evName: this.evName,
            causer: this.causer,
            receiver: this.receiver,
            message: this.message,
        }
    }
}

/**
 * Fired when a client has connected
 */
class REvConnect extends RopeEvent<null> {
    readonly evName = 'connect'
    readonly causer: string
    readonly receiver = null
    readonly message = null

    constructor(causer: string) {
        super()
        this.causer = causer
    }
}

/**
 * Fired when a client has disconnected
 */
class REvDisconnect extends RopeEvent<null> {
    readonly evName = 'disconnect'
    readonly causer: string
    readonly receiver = null
    readonly message = null

    constructor(causer: string) {
        super()
        this.causer = causer
    }
}

/**
 * Fired when a client has sent a message
 */
class REvMessage<InnerMessage = unknown> extends RopeEvent<InnerMessage> {
    readonly evName = 'message'
    readonly causer: string
    readonly receiver: string | null
    readonly message: InnerMessage

    constructor(causer: string, message: InnerMessage, receiver: string | null = null) {
        super()
        this.causer = causer
        this.receiver = receiver
        this.message = message
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
