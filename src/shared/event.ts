type RopeEventTypeName = 'connect' | 'disconnect' | 'message'

/**
 * The base class for all rope events
 */
abstract class RopeEvent {
    /**
     * The typeName of the event
     */
    abstract readonly typeName: RopeEventTypeName
    /**
     * The id of the creator of the event
     */
    abstract readonly causer: string
    /**
     * The id of the receiver of the event, `null` if it is a broadcast event
     */
    abstract readonly receiver: string | null

    /**
     * Create a RopeEvent from a json object
     */
    static fromJson(json: Record<string, any>): RopeEvent {
        throw new Error("This method is abstract and should be implemented in the subclass.")
    }

    /**
     * Create a RopeEvent from a json string
     */
    static fromJsonString(jsonString: string): RopeEvent {
        return this.fromJson(JSON.parse(jsonString))
    }

    /**
     * Convert the RopeEvent to a json object
     */
    abstract toJson(): Record<string, any>

    /**
     * Convert the RopeEvent to a json string
     */
    toJsonString(): string {
        return JSON.stringify(this.toJson())
    }
}

/**
 * Fired when a client has connected
 */
class REvConnect extends RopeEvent {
    readonly typeName = 'connect'
    readonly causer: string
    readonly receiver = null

    constructor(causer: string) {
        super()
        this.causer = causer
    }

    toJson(): Record<string, any> {
        return {
            typeName: 'connect',
            causer: this.causer,
            receiver: null,
        }
    }
}

/**
 * Fired when a client has disconnected
 */
class REvDisconnect extends RopeEvent {
    readonly typeName = 'disconnect'
    readonly causer: string
    readonly receiver = null

    constructor(causer: string) {
        super()
        this.causer = causer
    }

    toJson(): Record<string, any> {
        return {
            typeName: 'disconnect',
            causer: this.causer,
            receiver: null,
        }
    }
}

/**
 * Fired when a client has sent a message
 */
class REvMessage<Message = any> extends RopeEvent {
    readonly typeName = 'message'
    readonly causer: string
    readonly receiver: string | null
    readonly message: Message

    constructor(causer: string, receiver: string | null, message: Message) {
        super()
        this.causer = causer
        this.receiver = receiver
        this.message = message
    }

    toJson(): Record<string, any> {
        return {
            typeName: 'message',
            causer: this.causer,
            receiver: this.receiver,
            message: this.message,
        }
    }
}

export {
    RopeEvent,
    REvConnect,
    REvDisconnect,
    REvMessage,
}
export type { RopeEventTypeName }
