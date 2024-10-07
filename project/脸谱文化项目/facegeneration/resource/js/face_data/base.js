import { Node } from "./node.js"

/*
    facedata
    本类用来实现脸谱数据的存储，这里我们将脸谱映射成三个属性，也就是一个脸谱对应一个三维向量（A1,A2,A3）
    这里我们用一棵字典树来维护脸谱和向量的关系,这棵树的深度为5，每次进行查询或者插入时都会从根节点触发，然后根据向量来进行寻找或者插入
    我们要实现的方法有
    1.insert()，将一组(A1 , A2 , A3)和对应的脸谱插入到树中
    2.query()，将一组(A1 , A2 , A3)传入，然后方法会根据这个向量找出对应脸谱
    注意：
    1.A1被我们设定为核心属性，如果在图中没有找到(A1 , A2 , A3)对应的话，直接去查表将A1对应的输出返回
*/


// 定义枚举值
export const FaceType = {
    red: "红脸",
    blue: "蓝脸",
    black: "黑脸",
    white: "白脸",
    green: "绿脸",
    yellow: "黄脸",
    purple: "紫脸",
    gold: "gold", // 神仙
    silver: "silver", // 怪物
}

export class FaceData {
    constructor() {
        this.nodes = [];
        this.cnt = 0;
        this.nodes[this.cnt] = new Node(this.cnt, "origin");
        this.cnt++;

        this.insert("忠勇义烈", "耿直", "血性", FaceType.red);
        this.insert("桀骜不驯", "有心计", "刚直", FaceType.blue);
        this.insert("公正刚直", "铁面无私", "正义", FaceType.black);
        this.insert("勇猛无比", "直率", "莽撞", FaceType.black);
        this.insert("阴险狡诈", "多疑", "刚愎自用", FaceType.white);
        this.insert("顽强骁勇", "暴躁", "勇敢", FaceType.green);
        this.insert("枭勇凶猛", "威猛", "彪悍", FaceType.yellow);
        this.insert("刚正稳练", "威猛", "彪悍", FaceType.purple);


        this.keyList = {
            "忠勇义烈": "红脸",
            "桀骜不驯": "蓝脸",
            "公正刚直": "黑脸",
            "勇猛无比": "黑脸",
            "阴险狡诈": "白脸",
            "顽强骁勇": "绿脸",
            "枭勇凶猛": "黄脸",
            "刚正稳练": "紫脸",
        }

    }

    init() {

    }

    // 一组向量插入对应的type
    insert(A1, A2, A3, type) {
        // 从原点开始，寻找A1
        let id = 0;
        for (let i = 0; i < 4; i++) {
            let A = "";
            if (i == 0) {
                A = A1;
            } else if (i == 1) {
                A = A2;
            } else if (i == 2) {
                A = A3;
            } else if (i == 3) {
                A = type;
            }
            let t = this.search(id, A);
            if (t == false) { // 没有找到，则插入属性为A1的Node
                // 先创建一个新的Node，id为cnt，Attribution为A
                this.nodes[this.cnt] = new Node(this.cnt, A);
                this.nodes[id].add_edge(this.cnt);
                id = this.cnt;
                this.cnt++;
            } else { // 则说明t接收到一个id，这个id就是对应A的Node的id
                id = t;
            }
        }

    }

    query(A1, A2, A3) {

        let id = 0; // 从原点开始出发
        for (let i = 0; i < 4; i++) {
            let A = "";
            if (i == 0) {
                A = A1;
            } else if (i == 1) {
                A = A2;
            } else if (i == 2) {
                A = A3;
            }

            if (i == 3) {
                let face = this.search(id, "face");
                if (face == null) return this.queryKey(A1);
                else return face;
            }

            let t = this.search(id, A);
            if (t === false) {
                return this.queryKey(A1);
            }
            id = t;
        }

        return face; // 返回 

    }

    queryKey(A1) {


        for (let key in this.keyList) {
            if (key === A1) {
                return this.keyList[key];
            }
        }

    }

    // 查找对应id往前连接的类型为type的Node
    search(id, type) {

        let face = [];
        let face_cnt = 0;
        for (let i = 0; i < this.nodes[id].edge_cnt; i++) {
            let next_id = this.nodes[id].edge[i];
            if (type === "face") {
                face[face_cnt++] = this.nodes[next_id].attribution;
            } else if (this.nodes[next_id].attribution === type) {
                return next_id;
            }
        }

        if (type === "face" && face_cnt !== 0) {
            return face;
        }
        // 没有找到
        return false;

    }


}