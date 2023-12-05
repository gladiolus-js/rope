/**
 * The strategy to take when there is already a connection with the same identifier
 *
 * - `respect`: respect the existing connection and ignore the new one (default)
 * - `plunder`: disconnect the existing connection and replace it with the new one
 */
type RopeClientStrategy = 'respect' | 'plunder'

/**
 * The base class of all types of rope clients.
 *
 * This is more for constraint purposes, as the actual clients are implemented in the subclasses.
 */
abstract class RopeClient {
    /**
     * doc at {@link RopeClientStrategy}
     */
    abstract strategy: RopeClientStrategy

    // TODO: more segments to be added
}

export type {
    RopeClientStrategy
}

export {
    RopeClient
}