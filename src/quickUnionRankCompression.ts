class QuickUnionRankCompression<T>{
    N: number;
    dad: Array<number>;
    rank: Array<number>;
    count: number;
    constructor(N:number) {
        this.dad = new Array(N);
        this.rank = new Array(N);
        this.count = N;
        for (let i = 0; i < N; i++) {
            this.dad[i] = i;
            this.rank[i] = 0;
        }
    }
    find(p:any) {
        while (p != this.dad[p]) {
            this.dad[p] = this.dad[this.dad[p]];
            p = this.dad[p];
        }
        return p;
    }
    union(p:any, q:any) {
        let rootP = this.find(p);
        let rootQ = this.find(q);
        if (rootP == rootQ)
            return;
        if (this.rank[rootP] < this.rank[rootQ])
            this.dad[rootP] = rootQ;
        else if (this.rank[rootP] > this.rank[rootQ])
            this.dad[rootQ] = rootP;
        else {
            this.dad[rootQ] = rootP;
            this.rank[rootP]++;
        }
        this.count--;
    }
}