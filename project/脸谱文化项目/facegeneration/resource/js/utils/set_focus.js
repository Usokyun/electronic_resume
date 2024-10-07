
export class SetFocus {

    constructor() {

        // 获取需要控制的组件
        const mycontainer = document.getElementById("mycontainer");
        const slides1 = document.getElementById("slides1");
        const slides2 = document.getElementById("slides2");
        const slides3 = document.getElementById("slides3");
        let tabindex = 0;
        slides1.focus();


        window.addEventListener("wheel", (event) => {
            event.preventDefault();
        }, { passive: false });

    }



    set_slides_index() {
        if (this.tabindex === 0) {
            this.slides1.focus();
        } else if (this.tabindex === 1) {
            this.slides2.focus();
        } else if (this.tabindex === 2) {
            this.slides3.focus();
        }
    }

    set_focus() {

        // 页面打开时会调用这个函数，所以我们直接将slides1聚焦

        // 阻止正常的滚轮移动


        // 设置滚轮切换
        window.addEventListener("wheel", (event) => {

            console.log(this.tabindex);

            if (event.deltaY > 0) { // 
                setTimeout(() => {
                    mycontainer.scrollBy({
                        top: 10,
                        left: 0,
                        behavior: "smooth",
                    })

                    this.tabindex++;
                    console.log(this.tabindex);
                    this.set_slides_index();
                }, 100)


            } else {
                setTimeout(() => {
                    mycontainer.scrollBy({
                        top: -10,
                        left: 0,
                        behavior: "smooth",
                    })

                    this.tabindex--;
                    this.set_slides_index();
                }, 100)

            }

        }, { passive: false })

    }


}

