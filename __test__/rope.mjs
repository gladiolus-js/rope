console.log('[Rope] worker is running...')

/**
 * Store all clients' ports in a map
 * @type {Map<string, MessagePort>}
 */
const clients = new Map()

// ========== ========== utils ========== ==========

/**
 * @param evName {'rejection' | 'message'}
 * @param sender {string}
 * @param receiver {string | null}
 * @param message {any}
 * @return {{evName, receiver, sender, message}}
 */
function messageBuilder(evName, sender, receiver = null, message = null) {
    return {
        evName,
        sender,
        receiver,
        message
    }
}

// ========== ========== logic ========== ==========

/**
 * @param clientId {string}
 * @param port {MessagePort}
 * @param strategy {'respect' | 'plunder'}
 */
function handleCreation(clientId, port, strategy) {
    // 1. newly created client
    if (!clients.has(clientId)) {
        clients.set(clientId, port)
        console.log(`[Rope] new client connected | [id: ${clientId}]`)
    }
    // 2. keep the old client, reject the new one
    else if (strategy === 'respect') {
        port.postMessage(messageBuilder('rejection', clientId))
        console.log(`[Rope] duplicate client is rejected | [id: ${clientId}]`)
    }
    // 3. keep the new client, reject the old one
    else if (strategy === 'plunder') {
        clients.get(clientId).postMessage(messageBuilder('rejection', clientId))
        clients.set(clientId, port)
        console.log(`[Rope] duplicate client is replaced | [id: ${clientId}]`)
    }
    // 4. invalid strategy
    else {
        console.warn(`[Rope] invalid strategy | [id: ${clientId}]`)
    }
}

/**
 * @param sender {string}
 * @param receiver {string | null}
 * @param message {any}
 */
function handleMessage(sender, receiver, message) {
    console.log(`[Rope] message received | [from: ${sender}] [to: ${receiver}] [message: ${message}]`)
    // 1. the receiver is not specified -- broadcast (except the sender)
    if (!receiver) {
        clients.forEach((port, clientId) => {
            if (clientId !== sender) {
                port.postMessage(messageBuilder('message', sender, null, message))
            }
        })
    }
    // 2. the receiver is specified -- unicast
    else {
        const port = clients.get(receiver)
        if (port !== undefined) {
            port.postMessage(messageBuilder('message', sender, receiver, message))
        }
    }
}

/**
 * @param msgEv {MessageEvent}
 */
function messageScheduler(msgEv) {
    /**
     * @type  {{evName: string, sender: string, receiver: string | null, message?: any}}
     */
    const innerEv = msgEv.data
    /**
     * This is the port of the client who sent the message
     * @type {MessagePort}
     */
    const port = msgEv.target

    switch (innerEv.evName) {
        case 'creation':
            handleCreation(innerEv.sender, port, innerEv.message)
            break
        case 'message':
            handleMessage(innerEv.sender, innerEv.receiver, innerEv.message)
            break
        default:
            console.warn('[Rope] messageScheduler: unknown message', innerEv)
            break
    }
}

// ========== ========== main ========== ==========

/**
 * Triggered when a new worker is created
 * @param ev {MessageEvent}
 */
onconnect = (ev) => {
    const port = ev.ports[0]

    port.onmessage = messageScheduler
}