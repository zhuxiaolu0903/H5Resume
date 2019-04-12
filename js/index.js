/**
 * REM layout
 */
~function(){
    function computeFontSize(){
        let dew = 640,
            winW = document.documentElement.clientWidth;
        if(winW >= dew){
            document.documentElement.style.fontSize = '100px';
        }else{
            document.documentElement.style.fontSize = winW / dew * 100 + 'px';
        }
    }
    computeFontSize();
    window.addEventListener('resize', computeFontSize);
}();

/**
 * loadingRender
 * @returns {{init: init}}
 */
let loadingRender = function(){

    /**
     * ATTRIBUTE
     * @type {jQuery.fn.init|jQuery|HTMLElement}
     */

    //需要操作的DOM元素
    let $loadingBox = $('.loadingBox'),
        $progress = $('.progress'),
        $progressing = $progress.find('.progressing');
    //所有需要加载的图片资源
    let imgList = ["img/cube_bg.png","img/load_bg.png","img/message_bg.png","img/my.png","img/number_bg.png","img/page1_bg.png","img/page2_bg.png","img/phone_head.png","img/teacher.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png"]
    let imgNum = 0, // 当前已经加载过的图片个数
        imgLen = imgList.length; //需要加载的图片总数
    let loadTimer = null; //异常加载定时器

    /**
     * FUNCTION
     */

    //加载完成执行的回调方法
    function loadFinlish(){
        //停留等待1s, 再进入下一个页面
        let waitTimer = window.setTimeout(() => {
            //关闭LOADING页面
            $loadingBox.remove();
            window.clearTimeout(waitTimer);

            phoneRender.init();
        }, 1000);
    }

    //加载图片资源的方法
    function loadImag(callback){
        imgList.forEach( item => {
            //item 为循环的每一项
            let tempImg = new Image;
            tempImg.src = item;
            tempImg.onload = () => {
                //加载完成
                imgNum ++;
                $progressing.css('width', imgNum / imgLen * 100 + '%');
                tempImg = null;
                //图片资源全部加载完成
                if(imgNum === imgLen){
                    //清除异常加载定时器
                    window.clearTimeout(loadTimer);
                    //执行回调函数
                    callback && callback();
                }
            };
        });
    }

    //资源加载异常处理方法
    function loadTimeout(interval = 5000, callback){ //设置网络异常时间间隔， 默认值是: 5000
        loadTimer = window.setTimeout(() => {
            //已到达指定的时间
            if(imgNum >= imgLen - 5){ //还剩5张图片没有加载完
                //让进度条立即到达100%
                $progressing.css('width', '100%');
                //执行回调函数
                callback && callback();
            }else{ //加载过于缓慢，即加载异常
                alert('亲，你当前网络状况不佳，请稍后再试！');
                window.location.href = 'http://www.baidu.com';
            }
        }, interval);
    }

    return {
        init: function(){
            $loadingBox.css('display', 'block');
            //加载资源图片，设置进度条的宽度
            loadImag(loadFinlish);
            //考虑图片加载异常的情况: 加载超时
            loadTimeout(5000, loadFinlish);
        }
    }
}();

/**
 * phoneRender
 * @type {{init}}
 */
let phoneRender = function(){
    //ATTRIBUTE
    let $phoneBox = $('.phoneBox'),
        $span = $phoneBox.find('span'),
        $answer = $('.answer'),
        $aMarkLink = $answer.children('.markLink'),
        $hang = $('.hang'),
        $hMarkLink = $hang.children('.markLink'),
        iphoneBell = document.querySelector('#iphoneBell'),
        hangBell = document.querySelector('#hangBell');
    let autoTimer = null; //计时定时器

    //FUNCTION

    /**
     * 关闭接听界面
     */
    function closeAnswer(){
        $answer.remove();
        iphoneBell.pause();
        //=>一定要先暂停播放然后再移除，否则即使移除了浏览器也会播放着这个声音
        $(iphoneBell).remove();

        //将接听界面移入
        hangBell.play();
        $hang.css('transform', 'translateY(0rem)');

        //显示计时器并开始计时
        showTimeAndComputedTime();
    }

    /**
     * 显示时间和计算时间
     */
    function showTimeAndComputedTime(){
        $span.css('display', 'block');
        let duration = 0;
        //当音乐资源加载完毕, 获取总的播放时长
        // hangBell.oncanplay = function(){
        //     duration = this.duration;
        // };
        let minute = 0,
            second = 0;

        //播放计时定时器
        autoTimer = window.setInterval(() => {
            second ++;
            duration = this.duration;
            //播放完毕
            if((minute * 60 + second) > duration){
                window.clearTimeout(autoTimer);
                closePhone();
                return;
            }
            if(second >= 60){
                minute ++;
                second = 0;
            }
            minuteStr = minute >= 10 ? minute : '0' + minute;
            secondStr = second >= 10 ? second : '0' + second;
            $span.html(`${minuteStr}:${secondStr}`); //模板字符串
        }, 1000);
    }

    /**
     * 关闭PHONE页面
     */
    function closePhone(){
        //清除定时器
        window.clearTimeout(autoTimer);
        hangBell.pause();
        $(hangBell).remove();
        $phoneBox.remove();

        //进入下一个界面
        messageRender.init();
    }

    return {
        init: function(){
            $phoneBox.css('display', 'block');
            //播放音乐
            iphoneBell.play();

            //绑定点击事件
            $aMarkLink.tap(closeAnswer);
            $hMarkLink.tap(closePhone);
        }
    }
}();

/**
 * messageRender
 * @type {{init}}
 */
let messageRender = function(){
    let $messageBox = $('.messageBox'),
        $messageList = $('.messageList'),
        $liList = $messageList.children('li'),
        $keyboard = $('.keyboard'),
        $span = $keyboard.children('span'),
        $sendLink = $('.sendLink'),
        message_music = document.querySelector('#message_music');

    let num = -1; //已经显示的消息数
    let autoTimer = null; //自动播放消息定时器
    let offsetHeight = 0; //当前ul列表向上移动的高度
    //FUNCTION

    /**
     * 显示消息列表
     */
    function showMessage(){
        if(num === 1){ //已经播放两条消息了
            window.clearTimeout(autoTimer);
            //显示键盘
            $keyboard.css('transform', 'translateY(0rem)');
            sendText();
            return;
        }
        if(num === ($liList.length - 1)){ //消息已经发送完毕
            window.clearTimeout(autoTimer);
            closeMessage();
            return;
        }
        if(num >= 4){ //发送的消息已经发送了5条
            offsetHeight = offsetHeight - $liList[num + 1].offsetHeight - 20; //这里还要减去margin值
            $messageList.css('transform', `translateY(${offsetHeight}px)`);
        }
        let oLi = $liList.eq(++num);
        oLi.addClass('active');
    }

    /**
     * 发送文本
     */
    function sendText(){
        let textStr = '好的,马上介绍！',
            textNum = 0, //已经显示的字符数
            textLen = textStr.length;
        let sendTimer = window.setInterval(function(){
            $span.html($span.html() + textStr[textNum]);
            textNum ++;
            if(textNum === textLen){
                window.clearInterval(sendTimer);
            }
        }, 300);
    }

    /**
     * 发送消息
     */
    function sendMessage(){
        //移除键盘
        $keyboard.css('transform', 'translateY(3.7rem)');
        //将第三条消息发送出去
        let str = '<li class="my">' +
                    '<i class="avatar"></i>' +
                    '<i class="pic"></i>' +
                    '<div class="dialog">' +
                        `${$span.html()}` +
                    '</div>' +
                  '</li>';
        $(str).insertAfter($liList.eq(1)).addClass('active');
        //清除文字
        $span.html('');
        //重新获取li列表
        $liList = $messageList.children('li');
        //更新发送数量
        num++;
        //继续发送消息
        autoTimer = window.setInterval(showMessage, 1000);
    }

    /**
     * 关闭消息界面
     */
    function closeMessage(){
        message_music.pause();
        $(message_music).remove();
        $messageBox.remove();

        cubeRender.init();
    }

    return {
        init: function(){
            $messageBox.css('display', 'block');
            showMessage();
            autoTimer = window.setInterval(showMessage, 1000);
            $sendLink.tap(sendMessage);

            message_music.play();
        }
    }
}();

/**
 * cubeRender
 * @type {{init}}
 */
let cubeRender = function(){
    let $cubeBox = $('.cubeBox'),
        $cubeList = $('.cubeList'),
        $liList = $cubeList.children('li'),
        cube_music = document.querySelector('#cube_music');

    /**
     * 移动开始
     */
    function start(e){
        //记录手指的初始位置 this: $cubeList
        let pointer = e.changedTouches[0];
        this.strX = pointer.pageX;
        this.strY = pointer.pageY;
        this.changeX = 0; //X轴移动的距离
        this.changeY = 0; //Y轴移动的距离
    }

    /**
     * 移动中
     */
    function move(e){
        //用最新手指的位置-起始的位置，记录X/Y轴的偏移
        let pointer = e.changedTouches[0];
        let curX = pointer.pageX;
        let curY = pointer.pageY;
        this.changeX = curX - this.strX;
        this.changeY = curY - this.strY;
    }

    /**
     * 移动结束
     */
    function end(e){
        //=>获取自定义属性上的CHANGE/ROTATE值
        //对象展开运算符
        let {changeX, changeY, rotateX, rotateY} = this;
        let isSwipe = false; //用于标识当前用户的操作是否是滑动操作
        if(Math.abs(changeX) > 10 || Math.abs(changeY) > 10){ //验证是否发生移动（判断滑动误差）
            isSwipe = true; //当前操作是滑动操作
        }
        if(isSwipe){ //只有发生移动再处理
            //左滑：changeX 为负值，rotateY 要减小 => rotateY = rotateY + changeX
            //右滑：changeX 为正值，rotateY 要增大 => rotateY = rotateY + changeX
            //上滑：changeY 为负值，rotateX 要增大 => rotateX = rotateX - changeY
            //下滑：changeY 为正值，rotateX 要减小 => rotateX = rotateX - changeY

            //1.左右滑=>changeX => rotateY (正比:CHANGE越大ROTATE越大)
            //2.上下滑=>changeY => rotateX (反比:CHANGE越大ROTATE越小)
            //3.为了让每一次操作旋转角度小一点，我们可以把移动距离的1/3作为旋转的角度即可
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY + changeX / 3;
            //=>赋值给魔方盒子
            $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            //=>让当前旋转的角度成为下一次起始的角度
            this.rotateX = rotateX;
            this.rotateY = rotateY;
        }
    }
    return {
        init: function(){
            $cubeBox.css('display', 'block');

            //音乐开始播放
            cube_music.play();

            ////=>记录魔方初始的旋转角度（存储到自定义属性上）
            let cube = $cubeList[0];
            cube.rotateX = -35;
            cube.rotateY = 35;

            //绑定事件
            $cubeList.on('touchstart', start);
            $cubeList.on('touchmove', move);
            $cubeList.on('touchend', end);

            $liList.tap(function(e){
                let target = e.target;
                $cubeBox.css('display', 'none');
                let index = $(target.parentNode).index();
                detailRender.init(index);
            });
        }
    }
}();

/**
 * detailRender
 * @type {{init}}
 */
let detailRender = function(){
    let $detailBox = $('.detailBox'),
        $page1 = $('.page1'),
        $dl = $page1.children('dl'),
        mySwiper = null;

    function initSwipe(){
        mySwiper = new Swiper ('.swiper-container', {
            effect: 'coverflow',
            //绑定事件
            onInit: move,
            onTransitionEnd: move,
        })
    }

    /**
     * 初始化完成或者动画结束需要执行的方法
     */
    function move(swiper){ //swiper: 当前创建的实例
        let activeId = swiper.activeIndex, //当前slide的ID
            swiperList = swiper.slides; //所有的slide集合

        //1.判断当前是否为第一个SLIDE:如果是让3D菜单展开,不是收起3D菜单

        if(activeId === 0){ //当前是显示的是第一个slide
            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $dl.makisu('open');
        }else {
            //=>OTHER PAGE
            $dl.makisu({
                selector: 'dd',
                speed: 0
            });
            $dl.makisu('close');
        }
        //2.滑动到哪一个页面，把当前页面设置对应的ID，其余页面移除ID即可
        swiperList.forEach((item, index) => {
            if(activeId === index){
                item.id = `page${index + 1}`;
                return;
            }
            item.id = null;
        })

    }

    /*手指向上滑动，回到魔方页面*/
    function backCube(){
        $(this).css('display', 'none');
        cubeRender.init();
    }

    return {
        init: function(slideID){
            $detailBox.css('display', 'block');
            //初始化Swipe
            if(!mySwiper){
                //=>防止重复初始化
                initSwipe();
            }
            mySwiper.slideTo(slideID, 0); //直接运动到具体的slide页面（第二个参数是切换到速度：0立即切换，没有切换的动画效果）
            $detailBox.swipeDown(backCube);
        }
    }
}();


/*以后在真实的项目中，如果页面中有滑动的需求，我们一定要把DOCUMENT本身滑动的默认行为阻止掉（不阻止：浏览器中预览，会触发下拉刷新或者左右滑动切换页卡等功能）*/
$(document).on('touchstart touchmove touchend', (ev) => {
    // 判断默认行为是否可以被禁用
    if (ev.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!ev.defaultPrevented) {
            ev.preventDefault();
        }
    }
});

//hash路由设置
~function(){
    let url = window.location.href,
        hashIndex = url.indexOf('#'),
        hash = '';
    if(hashIndex > -1){
        hash = url.substr(hashIndex + 1);
    }
    switch(hash){
        case 'loading':
            loadingRender.init();
            break;
        case 'phone':
            phoneRender.init();
            break;
        case 'message':
            messageRender.init();
            break;
        case 'cube':
            cubeRender.init();
            break;
        case 'detail':
            detailRender.init();
            break;
        default:
            loadingRender.init();
    }
}();