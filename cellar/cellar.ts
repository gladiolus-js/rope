const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class Cellar {
    readonly #inner: HTMLIFrameElement

    get #ctx() {
        return this.#inner.contentWindow!
    }

    readonly #ready: Promise<void>

    get ready() {
        return this.#ready
    }

    #resp: Map<string, Function> = new Map()

    #setupListener() {
        window.addEventListener('message', (ev) => {
            try {
                const { proof, result } = ev.data
                const resp = this.#resp.get(proof)
                if(resp) {
                    resp(result)
                    this.#resp.delete(proof)
                }
            } catch (err) {
                console.error('fail to handle message', ev, err)
            }
        })
    }

    constructor(uri: string) {
        const tryGet = document.getElementById('cellar-inner')
        if(tryGet) {
            this.#inner = tryGet as HTMLIFrameElement
            this.#ready = Promise.resolve()
        } else {
            const cellar = document.createElement('iframe')
            this.#inner = cellar
            cellar.id = 'cellar-inner'
            cellar.src = uri
            cellar.style.display = 'none'
            document.body.appendChild(cellar)
            this.#ready = new Promise((resolve, reject) => {
                cellar.onload = () => {
                    resolve()
                }
                cellar.onerror = (err) => {
                    reject(err)
                }
            })
        }

        this.#setupListener()
    }

    async common(fn: string, args: any[]): Promise<any> {
        const sig = uuidv4()
        const instance = this
        return new Promise(resolve => {
            instance.#resp.set(sig, resolve)
            instance.#ctx.postMessage({
                proof: sig,
                fn,
                args
            }, '*')
        })
    }

    async getItem(key: string): Promise<string> {
        return this.common('getItem', [ key ])
    }

    async setItem(key: string, value: string): Promise<void> {
        return this.common('setItem', [ key, value ])
    }

    async removeItem(key: string): Promise<void> {
        return this.common('removeItem', [ key ])
    }

    async clear(): Promise<void> {
        return this.common('clear', [])
    }
}

export {
    Cellar
}
