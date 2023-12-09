/**
 * Global configuration for the rope, modify this before creating any rope client to change default behavior.
 */
abstract class RopeConfig {
    /**
     * The `scriptURL` argument for `SharedWorker`.
     *
     * @default './rope.mjs'
     */
    public static workerURL: string = './rope.mjs'

    /**
     * The `src` attribute for the iframe.
     */
    public static iframeURL: string = 'TODO'
}

export {
    RopeConfig
}