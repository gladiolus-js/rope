/**
 * The id of a rope client, which is unique in the rope server it is connected to
 *
 * Aliased for semantic purposes, to distinguish it from plain string.
 */
type RopeClientId = string

/**
 * The target of a RopeEvent, which is either a client id or `null` for broadcast events
 */
type RopeEventTarget = RopeClientId | null

/**
 * The handler to handle incoming messages.
 *
 * @param msg the message to handle
 * @param from the sender's id
 */
type RopeEventHandler<Message> = (msg: Message, from: RopeClientId) => void

/**
 * The strategy to take when there is already a connection with the same identifier
 *
 * - `respect`: respect the existing connection and ignore the new one
 * - `plunder`: disconnect the existing connection and replace it with the new one
 */
type RopeClientStrategy = 'respect' | 'plunder'

/**
 * The base class of all types of rope clients.
 *
 * This is more for constraint purposes, as the actual clients are implemented in the subclasses.
 */
abstract class RopeClient<MessageIn = unknown, MessageOut = MessageIn> {
    /**
     * The id of the client, which is unique in the rope server it is connected to
     */
    public readonly id: string

    /**
     * doc at {@link RopeClientStrategy}
     */
    public readonly strategy: RopeClientStrategy

    /**
     * The handler to handle incoming messages.
     * @protected
     */
    protected handler: RopeEventHandler<MessageIn> | null = null

    /**
     * Register a handler to handle incoming messages. If `null` is passed, the handler will be unregistered.
     * @param handler the handler to handle incoming messages
     */
    public handle(handler: RopeEventHandler<MessageIn> | null) {
        this.handler = handler
    }

    /**
     * The handler to handle the rejection of the client.
     * @protected
     */
    protected onRejected: VoidFunction | null

    public handleRejection(handler: VoidFunction | null) {
        this.onRejected = handler
    }

    protected constructor(
        id: string,
        strategy: RopeClientStrategy,
        handler: RopeEventHandler<MessageIn> | null,
        onRejected: VoidFunction | null,
    ) {
        this.id = id
        this.strategy = strategy
        this.handler = handler
        this.onRejected = onRejected
    }

    /**
     * Send a message to the target.
     * @param message the message to send
     * @param to the target of the message, `null` for broadcast
     */
    public abstract send(message: MessageOut, to: RopeEventTarget): void
}

export type {
    RopeClientId,
    RopeEventTarget,
    RopeEventHandler,
    RopeClientStrategy
}

export {
    RopeClient
}