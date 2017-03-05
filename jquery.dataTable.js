/***DataTable的封装 by PoppinRubo****************开始了***************/
/*选择行对象 对于复选框 外部可访问*/
var CheckData = [];
/*url返回的数据用于取出行数据*/
var GetJSONData = null;

(function (d) {/*使用之前记得要引入JQ*/
    /*调试模式,默认关闭*/
    var DebugMsg = false;
    /*记住当前表格,内部方法方法*/
    var T = null;
    /*记录配置*/
    var TableObject = null;
    /**
     * @return {boolean}
     */
    d.fn.DataTable = function (Object) {/*使用table绑定 注意要用使用ID*/
        /*先清空*/
        CheckData = [];
        GetJSONData = null;
        /*清空 end*/
        var Table = d(this);
        Table.html("");
        /*d是传进来的元素 d(this)就是这个table*/
        T = Table;
        /*URl 方式创建DataTable 该链接返回的数据为json格式*/

        if (bind(Object.debug)) {/*是否开启调试模式*/
            DebugMsg = Object.debug;
        }
        var url = Object.url;
        if (!bind(url)) {/*检查是否绑定URL*/
            debug("未绑定url");
            return false;
        }
        var columns = Object.columns;
        if (!bind(columns)) {/*检查是否绑定表格配置*/
            debug("未绑定columns");
            return false;
        }
        /*生成表头*/
        /*插入表头行*/
        Table.append("<tr class='dt_head'></tr>");
        for (var h = 0; h < columns.length; h++) {
            /*列宽控制*/
            var w = Object.columns[h]["width"];
            var width = "auto";
            /*列宽默认自动*/
            if (bind(w)) {/*检查是否有自定义列宽*/
                width = w + "px";
            }
            /*插入表头列*/
            Table.find("tr").eq(0).append("<td style='width:" + width + ";'>" + columns[h]['title'] + "</td>");
        }
        var check = Object.check;
        if (bind(check)) {/*检查是否开启复选框 生成表头*/
            if (check) {
                Table.find("tr").eq(0).prepend("<td title='全选' style='width:25px'><input class='dt_check_all' type='checkbox'></td>");
            }
        }
        /*加载效果开始*/
        var loading = '<div id="dt_loading" style="position: absolute;left: 0;top:0;color:#232323;background:rgba(250, 250, 250, 0.7);z-index: 500;width: 100%;height: 100%;' +
            'text-align: center;font-size: 14px;font-family:Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,WenQuanYi Micro Hei,Microsoft Yahei,sans-serif;">' +
            '<span style="margin-top: 22%;position: absolute;"><span class="dt_animation" style="position:relative;width:20px;height:20px;background:#232323;">3</span></span>' +
            '<span style="margin-top: 25%;position: absolute;">加载中...</span></div>';
        Table.append(loading);
        var dt_animation = $(".dt_animation");
        var startAnimation = function () {
            dt_animation.animate({left: 10}, "slow");
            dt_animation.animate({left: 30}, "slow");
            dt_animation.animate({left: 10}, "slow");
            dt_animation.animate({left: 0}, "slow", startAnimation);
        };
        /*启动动画 卖个萌*/
        startAnimation();
        /*加载效果结束*/
        $.getJSON(url, function (json) {/*根据URL拉取数据*/
            $("#dt_loading").remove();//移除动画
            startAnimation = null;
            if (json.length) {
                GetJSONData = json;
                for (var r = 0; r < json.length; r++) {/*遍历行*/
                    /*table组装行*/
                    Table.append("<tr></tr>");
                    for (var c = 0; c < columns.length; c++) {/*遍历列*/
                        /*行组装列*/
                        var facility = Object.columns[c]["type"];
                        /*列功能*/
                        var ColumnContent = null;
                        if (!bind(facility)) {/*检查是否绑定功能*/
                            ColumnContent = json[r][columns[c].ColumnName];
                            ColumnTitle = ColumnContent;
                        }
                        if (bind(facility)) {
                            if (facility == "edit") {
                                ColumnContent = "<span  class='dt_edit'>编辑</span>";
                                ColumnTitle = "编辑";
                            }
                            if (facility == "del") {
                                ColumnContent = "<span class='dt_del'>删除</span>";
                                ColumnTitle = "删除";
                            }

                        }
                        /*生成一行一列 data-row= 为自定义标签用于识别行 */
                        Table.find("tr").eq(r + 1).append("<td data-row='" + parseInt(r + 2) + "'  title='" + ColumnTitle + "'>" + ColumnContent + "</td>");
                    }
                    if (bind(check)) {/*检查是否开启复选框 绑定行*/
                        if (check) {
                            Table.find("tr").eq(r + 1).prepend("<td><input class='dt_checkbox' type='checkbox'></td>");
                        }
                    }
                }
                /*Table样式*/
                Table.css({
                    "border-collapse": "collapse",
                    "font-family": '"Microsoft YaHei", "微软雅黑", helvetica, arial, verdana, tahoma, sans-serif',
                    "font-size": "14px",
                    "table-layout": "fixed",
                    "position": "absolute",
                    "left": " 0",
                    "top": "0"
                });
                Table.find("td").css({
                    "border": "1px solid #d8d8d8",
                    "padding": "5px",
                    "overflow": "hidden",
                    "white-space": "nowrap",
                    "cursor": "pointer",
                    "text-align": "left",
                });
                Table.find("tr").eq(0).find("td").css({
                    "cursor": "auto",
                });
                Table.find("tr").eq(0).find("td").eq(0).css({
                    "cursor": "pointer",
                });
                Table.find(".dt_checkbox,.dt_check_all").css({
                    "width": "15px",
                    "height": "15px",
                    "margin": "0 auto",
                    "display": "block"
                });
                Table.find("td span").css({
                    "padding": "1px 10px",
                    "overflow": "hidden",
                    "white-space": "nowrap",
                    "text-align": "center",
                    "line-height": "100%",
                    "border-radius": "3px",
                    "background": " #232323",
                    "-moz-user-select": "none", /*火狐*/
                    "-webkit-user-select": "none", /*webkit浏览器*/
                    "-ms-user-select": "none", /*IE10*/
                    "user-select": "none",
                    "color": "#ffffff",
                    "z-index": "100"
                });
                var ButtonColor = Object.ButtonColor;
                if (bind(ButtonColor)) {
                    Table.find("td span").css({"background": ButtonColor});
                }
                Table.find("tr").hover(function () {
                    if (this.className != "dt_head") {
                        this.style.backgroundColor = "#d8d8d8";
                    }
                }, function () {
                    this.style.backgroundColor = "rgba(216, 216, 216, 0)";
                });
                var TableStyle = Object.style;
                if (bind(TableStyle)) {/*检查是否自定义table样式*/
                    Table.css(TableStyle);
                }
                var align = Object.align;
                if (bind(align)) {
                    Table.find("td").css("text-align", align);
                }
                if (bind(check)) {/*检查是否开启复选框 完成对应代码*/
                    /*复选框控制 开始*/
                    /*行选*/
                    Table.find("td").click(function (ev) {
                        if (ev.target === this && this.parentNode.className != "dt_head") {/*防止事件错乱，并且不启用表头行选*/
                            this.parentNode.firstChild.firstChild.click();
                        }
                        if (ev.target === this && this.firstChild.className == "dt_check_all") {/*选所在td*/
                            $(".dt_check_all").click();
                        }
                    });
                    /*点选*/
                    var dt_checkbox = $(".dt_checkbox");
                    dt_checkbox.click(function (ev) {
                        /*点选加入到数组*/
                        var data = GetClickRowData(this, 1);
                        if (data != null) {
                            CheckData.push(data);
                        }

                    });
                    /*全选*/
                    var all = 0;
                    $(".dt_check_all").click(function () {
                        if (all == 0) {
                            dt_checkbox.click();
                            dt_checkbox.prop("checked", true);
                            all = 1;
                        } else {
                            dt_checkbox.click();
                            dt_checkbox.prop("checked", false);
                            all = 0;
                        }
                    });
                    /*复选框控制 结束*/
                }

                /*******事件方法 开始*******/
                $(".dt_edit").click(function () {/*编辑点击方法*/
                    var data = GetClickRowData(this, 0);
                    /*获取绑定 参数数据 点击行*/
                    Object.editClick(data);

                });
                $(".dt_del").click(function () {/*删除点击方法*/
                    var data = GetClickRowData(this, 0);
                    /*获取绑定 参数数据 点击行*/
                    Object.delClick(data);
                });
                /*定义setTimeout执行方法 解决单击双击冲突*/
                var TimeFn = null;
                Table.find("td").click(function (ev) {/*单击事件方法*/
                    if (!bind(Object.Click)) {
                        /*未开启单击*/
                        return;
                    }
                    /*把它先储存 避免与setTimeout错乱*/
                    var t = this;
                    clearTimeout(TimeFn);
                    /*执行延时*/
                    TimeFn = setTimeout(function () {
                        if (ev.target === t && t.lastChild.className != "dt_checkbox") {
                            var data = GetClickRowData(t, 2);
                            /*获取绑定 参数数据 点击行*/
                            Object.Click(data);
                        }
                    }, 300);

                });
                Table.find("td").dblclick(function (ev) {/*双击事件方法*/
                    if (!bind(Object.doubleClick)) {
                        /*未开启双击*/
                        return;
                    }
                    /*取消上次延时未执行的方法*/
                    clearTimeout(TimeFn);
                    /*双击事件的执行代码*/
                    if (ev.target === this && this.lastChild.className != "dt_checkbox") {
                        var data = GetClickRowData(this, 2);
                        /*获取绑定 参数数据 点击行*/
                        Object.doubleClick(data);
                    }
                });
                /*******事件方法 结束*******/
            } else {
                debug("返回数据为空");
            }
        });

    };
    /**下面是辅助方法**/
    function bind(b) {/*检查是否有绑定功能*/
        return typeof(b) != "undefined";
    }

    /*行点击操作*/
    /*c 代表的是点谁 c用来找td t代表是区别操作类型 返回行对象*/
    /*0 是编辑删除点击处理 1是复选框 2是单击取数据*/
    /**
     * @return {null|[]}
     */
    function GetClickRowData(c, t) {
        var RowData = [];
        var row = 0;
        /*一行的所有列*/
        if (t == 0) {
            row = GerRowData(c.parentNode);
        }
        if (t == 1) {
            row = GerRowData(c.parentNode.nextSibling);
            /*检查是选择还是取消*/
            if (!c.checked) {
                /*如果取消 之前该行存在的元素要移除*/
                var i = CheckData.length;
                while (i--) {
                    if (CheckData[i].LineNumber === row) {
                        CheckData.splice(i, 1);
                    }
                }
                return null;
            }

        }
        if (t == 2) {
            row = GerRowData(c);
        }

        if (row == 0) {
            return null;
        }
        /*提取数据 组装对象*/
        RowData = GetJSONData[row - 2];
        RowData.LineNumber = row;
        return RowData;
    }

    /*获取行号*/
    /**
     * @return {int}
     */
    function GerRowData(TdNode) {
        var row = TdNode.getAttribute("data-row");
        if (row != null && row != "") {
            return row
        }
        return 0;
    }

    function debug(msg) {/*调试模式 错误提醒*/
        if (DebugMsg) {
            $("body").append("<div id='DataTableDebugMsg'>DataTable提示: " + msg + "!</div>");
            var DataTableDebugMsg = $("#DataTableDebugMsg");
            T.html("");
            DataTableDebugMsg.css({
                "position": "fixed",
                "z-index": "9999",
                "margin": "0 auto",
                "left": "0",
                "right": "0",
                "background": "#FCFCFC",
                "font-size": "12px",
                "font-family": '"Microsoft YaHei", "微软雅黑", helvetica, arial, verdana, tahoma, sans-serif',
                "color": "#000000",
                "height": "60px",
                "width": "300px",
                "text-align": "center",
                "line-height": "60px",
                "border": "1px solid #d8d8d8",
                "border-radius": "3px",
                "top": "45%"
            });

            DataTableDebugMsg.fadeOut(6000, function () {
                DataTableDebugMsg.remove();
            });
        }
        return false;
    }

    /**上面是辅助方法**/
})(jQuery);
/*外部访问方法*/
/*返回的数组*/
var GetJSONArray = function () {
    return GetJSONData;
};
var GetCheckArray = function () {
    return CheckData;
};
/***DataTable的封装 by PoppinRubo****************结束了***************/
