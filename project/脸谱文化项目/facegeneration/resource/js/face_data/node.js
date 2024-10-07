export class Node {
    constructor(id, attribution) {
        this.attribution = attribution; // face_type 用来表示该节点的属性,可以是原点,A,或者是FaceType
        this.id = id; // id 用来唯一表示一个Node
        this.edge = []; // edge 里面存储连接的别的Node的id
        this.edge_cnt = 0;
    }

    // 连接一个节点
    add_edge(id) {
        this.edge[this.edge_cnt++] = id;
    }
}