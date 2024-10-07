import { Attribution } from "./attribution.js";
/*
    Attribution
    这个类的作用类似于Unity里面的ScriptableData对象，用来对页面展示的attribution进行存储
    实际上用户只能对A1选择一种属性，A2选择一种属性，A3选择一种属性，但是在展示的时候我们会将A1，A2，A3随机展示出来，并且如果用户这次选择了A1的属性
    那么在下一次选择中将会屏蔽掉A1的所有属性，让用户只能在A2和A3当中选
*/

export class AttributionData {
    constructor() {
        this.A = [[], [], []];
        // 红脸
        this.addAttribution(0, "忠勇义烈");
        this.addAttribution(1, "耿直");
        this.addAttribution(2, "血性");
        // 蓝脸
        this.addAttribution(0, "桀骜不驯");
        this.addAttribution(1, "有心计");
        this.addAttribution(2, "刚直");
        // 黑脸，包青天
        this.addAttribution(0, "公正刚直");
        this.addAttribution(1, "铁面无私");
        this.addAttribution(2, "正义");
        // 黑脸，张飞
        this.addAttribution(0, "勇猛无比");
        this.addAttribution(1, "直率");
        this.addAttribution(2, "莽撞");
        // 白脸
        this.addAttribution(0, "阴险狡诈");
        this.addAttribution(1, "多疑");
        this.addAttribution(2, "刚愎自用");
        // 绿脸
        this.addAttribution(0, "顽强骁勇");
        this.addAttribution(1, "暴躁");
        this.addAttribution(2, "勇敢");
        // 黄脸
        this.addAttribution(0, "枭勇凶猛");
        this.addAttribution(1, "威猛");
        this.addAttribution(2, "彪悍");
        // 紫脸
        this.addAttribution(0, "刚正稳练");


    }

    addAttribution(part, attribution) {

        this.A[part].push(new Attribution(part, attribution));
    }
}