"use strict";
var QuickUnionRankCompression = /** @class */ (function () {
    function QuickUnionRankCompression(N) {
        this.dad = new Array(N);
        this.rank = new Array(N);
        this.count = N;
        for (var i = 0; i < N; i++) {
            this.dad[i] = i;
            this.rank[i] = 0;
        }
    }
    QuickUnionRankCompression.prototype.find = function (p) {
        while (p != this.dad[p]) {
            this.dad[p] = this.dad[this.dad[p]];
            p = this.dad[p];
        }
        return p;
    };
    QuickUnionRankCompression.prototype.union = function (p, q) {
        var rootP = this.find(p);
        var rootQ = this.find(q);
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
    };
    return QuickUnionRankCompression;
}());
