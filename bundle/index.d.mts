/**
 * The id of a rope client, which is unique in the rope server it is connected to
 *
 * Aliased for semantic purposes, to distinguish it from plain string.
 */
type RopeClientId = string;
/**
 * The target of a RopeEvent, which is either a client id or `null` for broadcast events
 */
type RopeEventTarget = RopeClientId | null;
/**
 * The handler to handle incoming messages.
 *
 * @param msg the message to handle
 * @param from the sender's id
 */
type RopeEventHandler<Message> = (msg: Message, from: RopeClientId) => void;
/**
 * The strategy to take when there is already a connection with the same identifier
 *
 * - `respect`: respect the existing connection and ignore the new one
 * - `plunder`: disconnect the existing connection and replace it with the new one
 */
type RopeClientStrategy = 'respect' | 'plunder';
/**
 * The base class of all types of rope clients.
 *
 * This is more for constraint purposes, as the actual clients are implemented in the subclasses.
 */
declare abstract class RopeClient<MessageIn = unknown, MessageOut = MessageIn> {
    /**
     * The id of the client, which is unique in the rope server it is connected to
     */
    readonly id: string;
    /**
     * doc at {@link RopeClientStrategy}
     */
    readonly strategy: RopeClientStrategy;
    /**
     * The handler to handle incoming messages.
     * @protected
     */
    protected handler: RopeEventHandler<MessageIn> | null;
    /**
     * Register a handler to handle incoming messages. If `null` is passed, the handler will be unregistered.
     * @param handler the handler to handle incoming messages
     */
    handle(handler: RopeEventHandler<MessageIn> | null): void;
    /**
     * The handler to handle the rejection of the client.
     * @protected
     */
    protected onRejected: VoidFunction | null;
    handleRejection(handler: VoidFunction | null): void;
    protected constructor(id: string, strategy: RopeClientStrategy, handler: RopeEventHandler<MessageIn> | null, onRejected: VoidFunction | null);
    /**
     * Send a message to the target.
     * @param message the message to send
     * @param to the target of the message, `null` for broadcast
     */
    abstract send(message: MessageOut, to: RopeEventTarget): void;
}

/**
 * Note: some of the types are one-way, meaning that they are only used in one direction.
 * - 'creation' is used to notify the worker that a client has been created.
 * - 'rejection' is used to notify the client that the worker has rejected the client.
 */
type RopeEventName = 'message' | 'creation' | 'rejection' | 'stat';
/**
 * An object that represents a RopeEvent
 *
 * consider `FromRopeEvent` / `IntoRopeEvent` for semantic usage
 */
type RopeEventObject<MessagePayload = unknown> = {
    evName: RopeEventName;
    sender: RopeClientId;
    receiver: RopeEventTarget;
    message: MessagePayload;
};
/**
 * Something converted from a RopeEvent.
 *
 * Aliased for semantic purposes, see {@link RopeEventObject} for the actual type
 */
type FromRopeEvent<T> = RopeEventObject<T>;
/**
 * Something that can be converted to a RopeEvent.
 *
 * Aliased for semantic purposes, see {@link RopeEventObject} for the actual type
 */
type IntoRopeEvent<T> = RopeEventObject<T>;
/**
 * The base class of all rope events.
 *
 * This is more for constraint purposes, as the actual events are implemented in the subclasses.
 */
declare abstract class RopeEvent<InnerMessage = unknown> {
    /**
     * The name of the event
     */
    readonly evName: RopeEventName;
    /**
     * The id of the creator of the event
     */
    readonly sender: RopeClientId;
    /**
     * The id of the receiver of the event, `null` if it is a broadcast event
     * @default null
     */
    readonly receiver: RopeEventTarget;
    /**
     * The message in the event, `null` if there is no message
     * @default null
     */
    readonly message: InnerMessage;
    protected constructor(evName: RopeEventName, sender: RopeClientId, receiver: RopeEventTarget, message: InnerMessage);
    /**
     * Create a RopeEvent from a json object
     */
    static fromJson<InnerMessage>(_from: IntoRopeEvent<InnerMessage>): RopeEvent<InnerMessage>;
    /**
     * Convert the RopeEvent to a json object
     */
    toJson(): FromRopeEvent<InnerMessage>;
}
/**
 * Represents a message packet
 */
declare class REvMessage<InnerMessage = unknown> extends RopeEvent<InnerMessage> {
    constructor(sender: RopeClientId, message: InnerMessage, receiver?: RopeEventTarget);
}
/**
 * Represents a client has been created
 *
 * ---
 * This is used to notify the worker that a client has been created.
 */
declare class RevCreation extends RopeEvent<RopeClientStrategy> {
    constructor(sender: RopeClientId, strategy: RopeClientStrategy);
}
/**
 * Represents a stat request
 */
declare class RevStat extends RopeEvent<null> {
    constructor(sender: RopeClientId);
}

/**
 * Global configuration for the rope, modify this before creating any rope client to change default behavior.
 */
declare abstract class RopeConfig {
    /**
     * The `scriptURL` argument for `SharedWorker`.
     *
     * @default './rope.mjs'
     */
    static workerURL: string;
    /**
     * The `src` attribute for the iframe.
     */
    static iframeURL: string;
}

/**
 * A rope client used in the same origin situation.
 *
 * This will use `SharedWorker` to communicate with each other.
 *
 * ---
 * @param id The id of the client
 * @param strategy The strategy of the client
 * @param handler The handler to handle incoming messages.
 * @param onRejected The handler to handle the rejection of the client. (required when `strategy` is `'respect'`)
 */
declare class RopeClientSameOrigin<MessageIn = unknown, MessageOut = MessageIn> extends RopeClient<MessageIn, MessageOut> {
    #private;
    constructor(id: string, strategy?: RopeClientStrategy, handler?: RopeEventHandler<MessageIn> | null, onRejected?: VoidFunction | null);
    send(message: MessageOut, to: RopeEventTarget): void;
    /**
     * Get the list of clients
     */
    stat(): Promise<RopeClientId[]>;
}

export { FromRopeEvent, IntoRopeEvent, REvMessage, RevCreation, RevStat, RopeClient, RopeClientId, RopeClientSameOrigin, RopeClientStrategy, RopeConfig, RopeEvent, RopeEventHandler, RopeEventName, RopeEventObject, RopeEventTarget };
