class Vertex<T>{
    info: T;
    next: Vertex<T>;
    weight: number;
    constructor(info?: T, next?: Vertex<T>,weight?: number) {
        this.info = info || null;
        this.next = next || null;
        this.weight = weight || null;
    }
}