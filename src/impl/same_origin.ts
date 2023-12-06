import { RopeClient, RopeClientStrategy, RopeEventTarget } from "../common/client";
import { RopeConfig } from "../common/config";
import { REvMessage } from "../common/event";

/**
 * A rope client used in the same origin situation.
 *
 * This will use `SharedWorker` to communicate with each other.
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
        // TODO: schedule the incoming message
        console.log('received message from worker:', ev.data)
    }

    constructor(id: string, strategy: RopeClientStrategy = 'respect', handler: ((ev: MessageIn) => void) | null = null) {
        super(id, strategy, handler);

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