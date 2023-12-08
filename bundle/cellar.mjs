// cellar/cellar.ts
var uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
var Cellar = class {
  #inner;
  get #ctx() {
    return this.#inner.contentWindow;
  }
  #ready;
  get ready() {
    return this.#ready;
  }
  #resp = /* @__PURE__ */ new Map();
  #setupListener() {
    window.addEventListener("message", (ev) => {
      try {
        const { proof, result } = ev.data;
        const resp = this.#resp.get(proof);
        if (resp) {
          resp(result);
          this.#resp.delete(proof);
        }
      } catch (err) {
        console.error("fail to handle message", ev, err);
      }
    });
  }
  constructor(uri) {
    const tryGet = document.getElementById("cellar-inner");
    if (tryGet) {
      this.#inner = tryGet;
      this.#ready = Promise.resolve();
    } else {
      const cellar = document.createElement("iframe");
      this.#inner = cellar;
      cellar.id = "cellar-inner";
      cellar.src = uri;
      cellar.style.display = "none";
      document.body.appendChild(cellar);
      this.#ready = new Promise((resolve, reject) => {
        cellar.onload = () => {
          resolve();
        };
        cellar.onerror = (err) => {
          reject(err);
        };
      });
    }
    this.#setupListener();
  }
  async common(fn, args) {
    const sig = uuidv4();
    const instance = this;
    return new Promise((resolve) => {
      instance.#resp.set(sig, resolve);
      instance.#ctx.postMessage({
        proof: sig,
        fn,
        args
      }, "*");
    });
  }
  async getItem(key) {
    return this.common("getItem", [key]);
  }
  async setItem(key, value) {
    return this.common("setItem", [key, value]);
  }
  async removeItem(key) {
    return this.common("removeItem", [key]);
  }
  async clear() {
    return this.common("clear", []);
  }
};
export {
  Cellar
};
