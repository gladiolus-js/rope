import { RopeClient, RopeClientStrategy, RopeEventTarget } from "../common/client";
import { RopeConfig } from "../common/config";
import { REvMessage } from "../common/event";

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
class RopeClientSameOrigin<MessageIn = unknown, MessageOut = MessageIn> extends RopeClient<MessageIn, MessageOut> {
    /**
     * Inner `SharedWorker` instance.
     * @private
     */
    #worker: SharedWorker

    #onRejected?: VoidFunction

    /**
     * The proxy function to handle incoming messages from the `SharedWorker` instance.
     * @private
     */
    #handlerProxy(ev: MessageEvent<REvMessage<MessageIn>>) {
        const rEv = ev.data

        if(rEv.evName === 'duplicate' && rEv.message) {
            this.#onRejected?.()
        } else if(rEv.evName === 'message') {
            this.handler?.(rEv.message)
        }
    }

    constructor(id: string, strategy: 'respect', handler: ((ev: MessageIn) => void) | null, onRejected: VoidFunction);
    constructor(id: string, strategy: 'plunder', handler: ((ev: MessageIn) => void) | null);
    constructor(id: string, strategy: RopeClientStrategy = 'respect', handler: ((ev: MessageIn) => void) | null = null, onRejected?: VoidFunction) {
        super(id, strategy, handler);

        this.#onRejected = onRejected

        const sw = new SharedWorker(RopeConfig.workerURL)
        this.#worker = sw
        sw.port.onmessage = this.#handlerProxy
    }

    send(message: MessageOut, to: RopeEventTarget): void {
        const ev = new REvMessage(this.id, message, to)
        this.#worker.port.postMessage(ev.toJson())
    }
}

export {
    RopeClientSameOrigin
}