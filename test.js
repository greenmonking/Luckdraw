/*
	version=1.0,作者=‘会飞的猴子,转载请注明出处！’
*/
;
(function($) {
    var Fn = function(options) {
        var self = this;
        self.def = {
            html: '', //抽奖效果，添加HTML标签
            hoverClass: '', //抽奖效果，在TD添加样式
            startTime: 50, //起始延迟时间
            onlyTime: 2, //延迟时间间隔
            endTime: 500, //最后出结果的延迟时间
            id: '', //抽奖按钮ID，JQ选择器语法
            way: 'click', //按钮绑定的事件，默认点击事件
            cycle: 3, //九宫格循环次数
            start: 5, //九宫格起始位置
            arr: [0, 1, 2, 5, 8, 7, 6, 3], //九宫格循环方向，默认顺时针
            runBefor: function() { //抽奖之前的函数，返回中奖位置，默认为第一格，返回false结束抽奖
                return 0;
            },
            callBack: function(i) { //回调函数
                //                alert(i);
            }
        };
        self.ops = $.extend(self.def, options);
    };
    //抽奖
    Fn.prototype.timeFn = function(s) {
        var self = this;
        var times = self.ops.startTime + (self.ops.count - s) * self.ops.onlyTime * (self.ops.cycle - s / 8); //计算延时时间:起始时间+离结束的间隔*间隔时间*圈数差的倍数
        if (s == 1) {
            times += self.ops.endTime;
        }
        if (self.ops.start > 7) {
            self.ops.start = self.ops.start - 8;
        }
        self.tClass();
        if (s == 0) {
            self.ops.callBack(self.ops.start);
            $(self.ops.id).one(self.ops.way, function() {
                self.run(self.ops.runBefor());
            });
            return;
        }
        setTimeout(function() {
            self.ops.tdArr.eq(self.ops.arr[self.ops.start]).removeClass(self.ops.hoverClass);
            self.ops.tdArr.eq(self.ops.arr[self.ops.start]).find('#tableLotteryId_0001').remove();
            ++self.ops.start;
            s--;
            self.timeFn(s);
        }, times);
    };
    //抽奖-切换效果
    Fn.prototype.tClass = function() {
        var self = this;
        var index = self.ops.arr[self.ops.start];
        if (self.ops.html) {
            self.ops.tdArr.eq(index).find('#tableLotteryId_0001').remove();
            self.ops.tdArr.eq(index).append(self.ops.html);
            self.ops.tdArr.eq(index).find('*').last().attr('id', 'tableLotteryId_0001');
        }
        self.ops.tdArr.eq(index).addClass(self.ops.hoverClass);
    };
    //计算遍历多少格，执行抽奖
    Fn.prototype.run = function(status) {
        $(this.ops.id).off(this.ops.way);
        var ops = this.ops;
        if (typeof status == 'number' && status >= 0) {
            status = parseInt(status);
        } else {
            return;
        }
        ops.count = 8 * ops.cycle + (8 - ops.start + status);
        var s = ops.count;
        this.timeFn(s);
    };

    Fn.prototype.init = function(my) {
        var self = this;
        self.ops.tdArr = my.find('td');
        $(self.ops.id).one(self.ops.way, function() {
            self.run(self.ops.runBefor());
        })
    };

    $.fn.tableLottery = function(options) {
        var my = $(this).eq(0);
        var myTableLottery = new Fn(options);
        myTableLottery.init(my);
        return myTableLottery;
    };

})(jQuery);