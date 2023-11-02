class XXX {
    static singleton: XXX

    constructor(public name: string) {
        if(XXX.singleton) {
            return XXX.singleton
        } else {
            XXX.singleton = this
        }
    }
}

const x1 = new XXX('x1')
const x2 = new XXX('x2')

console.log(x1 === x2)
console.log(x1.name, x2.name)