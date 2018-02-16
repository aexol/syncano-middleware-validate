"use strict";
class A {
    constructor(k, m) {
        this.k = k;
        this.m = m;
    }
    keys() {
        const keys = [];
        for (const k of Object.keys(this)) {
            if (Object.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    }
}
class B extends A {
    constructor(n, k, m) {
        super(k, m);
        this.n = n;
    }
}
console.log(new A('a', 'b').keys());
console.log(new B('a', 'b', 'c').keys());
