declare class A {
    k: string;
    m: string;
    constructor(k: string, m: string);
    keys(): string[];
}
declare class B extends A {
    n: string;
    constructor(n: string, k: string, m: string);
}
