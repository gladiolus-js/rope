// src/common/event.ts
var RopeEvent = class {
  /**
   * The name of the event
   */
  evName;
  /**
   * The id of the creator of the event
   */
  sender;
  /**
   * The id of the receiver of the event, `null` if it is a broadcast event
   * @default null
   */
  receiver;
  /**
   * The message in the event, `null` if there is no message
   * @default null
   */
  message;
  constructor(evName, sender, receiver, message) {
    this.evName = evName;
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
  }
  /**
   * Create a RopeEvent from a json object
   */
  static fromJson(_from) {
    throw new Error("This method is abstract and should be implemented in the subclass.");
  }
  /**
   * Convert the RopeEvent to a json object
   */
  toJson() {
    return {
      evName: this.evName,
      sender: this.sender,
      receiver: this.receiver,
      message: this.message
    };
  }
};
var RevCreation = class extends RopeEvent {
  constructor(sender, strategy) {
    super("creation", sender, null, strategy);
  }
};
var REvMessage = class extends RopeEvent {
  constructor(sender, message, receiver = null) {
    super("message", sender, receiver, message);
  }
};
var REvRejection = class extends RopeEvent {
  constructor(sender, receiver, rejected) {
    super("rejection", sender, receiver, rejected);
  }
};

// src/common/client.ts
var RopeClient = class {
  /**
   * The id of the client, which is unique in the rope server it is connected to
   */
  id;
  /**
   * doc at {@link RopeClientStrategy}
   */
  strategy;
  /**
   * The handler to handle incoming messages.
   * @protected
   */
  handler = null;
  /**
   * Register a handler to handle incoming messages. If `null` is passed, the handler will be unregistered.
   * @param handler the handler to handle incoming messages
   */
  handle(handler) {
    this.handler = handler;
  }
  /**
   * The handler to handle the rejection of the client.
   * @protected
   */
  onRejected;
  handleRejection(handler) {
    this.onRejected = handler;
  }
  constructor(id, strategy, handler, onRejected) {
    this.id = id;
    this.strategy = strategy;
    this.handler = handler;
    this.onRejected = onRejected;
  }
};

// src/common/config.ts
var RopeConfig = class {
  /**
   * The `scriptURL` argument for `SharedWorker`.
   *
   * @default 'TODO'
   */
  static workerURL = "TODO";
  /**
   * The `src` attribute for the iframe.
   */
  static iframeURL = "TODO";
};

// src/impl/same_origin.ts
var RopeClientSameOrigin = class extends RopeClient {
  /**
   * Inner `SharedWorker` instance.
   * @private
   */
  #worker;
  /**
   * The proxy function to handle incoming messages from the `SharedWorker` instance.
   * @private
   */
  #handlerProxy(ev) {
    const rEv = ev.data;
    if (rEv.evName === "rejection") {
      this.onRejected?.();
    } else if (rEv.evName === "message") {
      this.handler?.(rEv.message);
    } else {
      console.warn("[Rope] unknown event", rEv);
    }
  }
  constructor(id, strategy = "respect", handler = null, onRejected = null) {
    super(id, strategy, handler, onRejected);
    const sw = new SharedWorker(RopeConfig.workerURL, "rope");
    this.#worker = sw;
    sw.port.onmessage = (ev) => this.#handlerProxy(ev);
    sw.port.postMessage(new RevCreation(id, strategy).toJson());
  }
  send(message, to) {
    const ev = new REvMessage(this.id, message, to);
    this.#worker.port.postMessage(ev.toJson());
  }
};
export {
  REvMessage,
  REvRejection,
  RevCreation,
  RopeClient,
  RopeClientSameOrigin,
  RopeConfig,
  RopeEvent
};
