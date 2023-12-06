/**
 * Global configuration for the rope, modify this before creating any rope client to change default behavior.
 */
abstract class RopeConfig {
    /**
     * The `scriptURL` argument for `SharedWorker`.
     *
     * @default 'TODO'
     */
    public static workerURL: string = 'TODO'

    /**
     * The `src` attribute for the iframe.
     */
    public static iframeURL: string = 'TODO'
}

export {
    RopeConfig
}