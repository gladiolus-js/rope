import { RopeClient, RopeClientStrategy, RopeEventTarget } from "../common/client";
import { RopeConfig } from "../common/config";
import { RevCreation, REvMessage } from "../common/event";

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

    /**
     * The proxy function to handle incoming messages from the `SharedWorker` instance.
     * @private
     */
    #handlerProxy(ev: MessageEvent<REvMessage<MessageIn>>) {
        const rEv = ev.data

        if(rEv.evName === 'rejection') {
            this.onRejected?.()
        } else if(rEv.evName === 'message') {
            this.handler?.(rEv.message)
        } else {
            console.warn('[Rope] unknown event', rEv)
        }
    }

    constructor(
        id: string,
        strategy: RopeClientStrategy = 'respect',
        handler: ((ev: MessageIn) => void) | null = null,
        onRejected: VoidFunction | null = null,
    ) {
        super(id, strategy, handler, onRejected);

        // create the worker with fixed name (rope)
        const sw = new SharedWorker(RopeConfig.workerURL, 'rope')
        this.#worker = sw

        // `this` in the proxy function is not the instance of `RopeClientSameOrigin`
        sw.port.onmessage = ev => this.#handlerProxy(ev)

        // notify the worker that a client has been created
        sw.port.postMessage(new RevCreation(id, strategy).toJson())
    }

    send(message: MessageOut, to: RopeEventTarget): void {
        const ev = new REvMessage(this.id, message, to)
        this.#worker.port.postMessage(ev.toJson())
    }
}

export {
    RopeClientSameOrigin
}
