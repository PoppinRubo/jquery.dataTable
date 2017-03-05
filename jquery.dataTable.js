////////////////////////////
/* 版本号0.9 */
////////////////////////////

/*使用之前记得要引入JQ库*/
/*选择行对象 对于复选框 外部可访问*/
var CheckData = {};
/*url返回的数据用于取出行数据*/
var GetJSONData = {};

(function (d) {
    /*调试模式,默认关闭*/
    var DebugMsg = false;
    /*记录Table设置*/
    var TableSet = {};
    d.fn.dataTable = function (Obj) {/*使用table绑定 注意要用使用ID*/
        DebugMsg = false;
        /*d是传进来的元素 d(this)就是这个table*/
        var t = d(this);
        ClearTable(t);
        var tid = t[0].id;
        /*页码*/
        var page = 1;

        /*由于数据请求为异步执行,会造成多个表格绑定时发生不对应现象,方法事件会错乱，故采用CreateTable方法用调用方式传参*/
        /**
         * @return {boolean|function|[]|{}}
         */
        function CreateTable(Object, Table, TableID, page) {
            if (empty(TableSet[TableID])) {
                /*table 设置储存 写入记录*/
                TableSet[TableID] = {Object: Object, Table: Table};
            }
            /*启用历史 设置 更新url*/
            TableSet[TableID].Object.url = Object.url;
            /*页 容量 设置默认为10*/
            var pageCapacity = 10;
            if (!empty(Object.pageCapacity)) {
                TableSet[TableID].Object.pageCapacity = Object.pageCapacity;
            } else {
                TableSet[TableID].Object.pageCapacity = pageCapacity;
            }

            /*读出记录 开始*/
            Object = TableSet[TableID].Object;
            Table = TableSet[TableID].Table;
            pageCapacity = TableSet[TableID].Object.pageCapacity;
            /*读出记录 结束*/
            if (!empty(Object.debug)) {/*是否开启调试模式*/
                DebugMsg = Object.debug;
            }
            var columns = Object.columns;
            if (empty(columns)) {/*检查是否绑定表格配置*/
                debug("未绑定columns");
                return false;
            }

            /*生成表头*/
            /*插入表头行*/
            Table.append("<tr class='" + TableID + "_dt_head'></tr>");
            for (var h = 0; h < columns.length; h++) {
                /*列宽控制*/
                var w = Object.columns[h]["width"];
                var width = "auto";
                /*列宽默认自动*/
                if (!empty(w)) {/*检查是否有自定义列宽*/
                    width = w + "px";
                }
                /*插入表头列*/
                Table.find("tr").eq(0).append("<td class='" + TableID + "_td_head' style='width:" + width + ";'>" + columns[h]['title'] + "</td>");
            }
            if (!empty(Object.check)) {/*检查是否开启复选框 生成表头*/
                if (Object.check) {
                    Table.find("tr").eq(0).prepend("<td class='" + TableID + "_td' title='全选' style='width:25px'><input class='" + TableID + "_dt_check_all' type='checkbox'></td>");
                }
            }
            function TableStyle() {
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
                    "text-align": "left"
                });
                Table.find("tr").eq(0).find("td").css({
                    "cursor": "auto"
                });
                Table.find("tr").eq(0).find("td").eq(0).css({
                    "cursor": "pointer"
                });
                Table.find("." + TableID + "_dt_checkbox,." + TableID + "_dt_check_all").css({
                    "width": "15px",
                    "height": "15px",
                    "margin": "0 auto",
                    "display": "block"
                });
                Table.find(".Button").css({
                    "padding": "2px 10px",
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
                    "z-index": "100",
                    "cursor": "pointer"
                });
                var ButtonStyle = Object.ButtonStyle;
                if (!empty(ButtonStyle)) {
                    Table.find(".Button").css({
                        "background": ButtonStyle.backgroundColor,
                        "color": ButtonStyle.fontColor
                    });
                }
                Table.find("tr").hover(function () {
                    if (this.className != TableID + "_dt_head") {
                        this.style.backgroundColor = "#d8d8d8";
                    }
                }, function () {
                    this.style.backgroundColor = "rgba(216, 216, 216, 0)";
                });
                var TableStyle = Object.style;
                if (!empty(TableStyle)) {/*检查是否自定义table样式*/
                    Table.css(TableStyle);
                }
                var align = Object.align;
                if (!empty(align)) {
                    Table.find("." + TableID + "_td").css("text-align", align);
                    Table.find("." + TableID + "_td_head").css("text-align", align);
                }

            }

            /*URl数据请求 数据 方式创建DataTable 该地址返回的数据为json格式*/
            var url = Object.url;
            if (empty(url)) {/*检查是否绑定URL*/
                debug("未绑定url");
                /*table样式*/
                TableStyle();
                return false;
            }
            Animation(TableID, 'start');
            /*开始加载动画*/
            $.getJSON(url, {page: page, pageCapacity: pageCapacity}, function (json) {/*根据URL拉取数据*/
                Animation(TableID, 'stop');
                /*结束加载动画*/
                var total = json.total;
                json = json.rows;
                if (json != null) {
                    GetJSONData[TableID] = json;
                    for (var r = 0; r < json.length; r++) {/*遍历行*/
                        /*table组装行*/
                        Table.append("<tr></tr>");
                        for (var c = 0; c < columns.length; c++) {/*遍历列*/
                            /*行组装列*/
                            var ColumnContent = json[r][columns[c].ColumnName];

                            var ColumnTitle = ColumnContent;
                            /*列功能 打开编辑 删除 自定义*/
                            var facility = Object.columns[c]["button"];
                            if (!empty(facility)) {
                                if (facility == "") {
                                    debug("未定义按钮");
                                    return false;
                                }
                                var buttonName = Object.columns[c]["buttonName"];
                                if (empty(buttonName) || buttonName == "") {
                                    debug("自定义按钮未设置按钮名");
                                    return false;
                                }
                                ColumnContent = "<span data-button='" + facility + "' class='" + TableID + "_button_" + facility + " Button'>" + buttonName + "</span>";
                                ColumnTitle = buttonName;
                            }
                            /*生成一行一列 data-row= 为自定义标签用于识别行 */
                            Table.find("tr").eq(r + 1).append("<td class='" + TableID + "_td' data-row='" + parseInt(r + 2) + "'  title='" + ColumnTitle + "'>" + ColumnContent + "</td>");
                        }
                        if (!empty(Object.check)) {/*检查是否开启复选框 绑定行*/
                            if (Object.check) {
                                Table.find("tr").eq(r + 1).prepend("<td class='" + TableID + "_td_checkbox'><input class='" + TableID + "_dt_checkbox' type='checkbox'></td>");
                            }
                        }
                    }
                    /*页码部分 开始*/
                    /*页码工具 创建*/
                    var totalPage = Math.ceil(total / pageCapacity);
                    var pager = "<div class='tablePager' style='width: 100%;position: absolute;height: 35px;'>" +
                        "<span style='float: left;margin: 10px;'>显示条数:</span>" +
                        "<select class='Button " + TableID + "_select'>" +
                        "<option>10</option><option>20</option><option>30</option><option>40</option><option>50</option></select>" +
                        "<span class='Button " + TableID + "_firstPage' title='跳到第一页'>首页</span>" +
                        "<span class='Button " + TableID + "_aPage' title='上一页'>上一页</span>" +
                        "<span class='Button " + TableID + "_nextPage' title='下一页'>下一页</span>" +
                        "<span class='Button " + TableID + "_endPage' title='跳到最后一页'>尾页</span>" +
                        "<span class='" + TableID + "_PageInput' style='float: left;'>" +
                        "<input class='" + TableID + "_inp' maxlength='5' placeholder='跳页' style='width: 50px;margin: 6px;'>" +
                        "</span><span class='Button " + TableID + "_ok' title='跳到目标页'>确定</span>" +
                        "<span class='" + TableID + "_page_tip' style='float: left;margin: 10px;'>当前在第" + page + "页,总页" + totalPage + "页</span></div>";
                    Table.append(pager);
                    /*table样式*/
                    TableStyle();
                    var inp = $("." + TableID + "_inp");
                    /*限制键盘只能按数字键、小键盘数字键、退格键*/
                    inp.keydown(function (e) {
                        var code = parseInt(e.keyCode);
                        return !!(code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8);
                    });

                    /*文本框输入事件,任何非正整数的输入都重置为" "空白*/
                    inp.bind("input propertychange", function () {
                        if (isNaN(parseFloat($(this).val())) || parseFloat($(this).val()) <= 0) $(this).val("");
                    });
                    /*工具样式*/
                    Table.find(".tablePager").find(".Button").css({
                        "float": "left",
                        "padding": "5px",
                        "margin": "5px"
                    });
                    var CapacitySelect = Table.find(".tablePager").find("." + TableID + "_select");
                    CapacitySelect.css({
                        "padding": "1px"
                    });
                    inp.css({
                        "border-radius": "10px",
                        "padding-left": "10px",
                        "border": "solid 1px #d8d8d8",
                        "outline": "none"
                    });
                    /*页码容量*/
                    /*显示自定义显示容量*/
                    var op = Object.pageCapacity;
                    if (op != 10 && op != 20 && op != 30 && op != 40 && op != 50) {
                        CapacitySelect.prepend("<option>" + op + "</option>");
                    }
                    CapacitySelect.val(Object.pageCapacity);
                    CapacitySelect.change(function () {
                        ClearTable(Table);
                        /*容量更新*/
                        Object.pageCapacity = CapacitySelect.val();
                        CreateTable(Object, Table, TableID, page = 1);
                    });
                    /*首页*/
                    var firstPage = Table.find(".tablePager").find("." + TableID + "_firstPage");
                    firstPage.click(function () {
                        if (page == 1) {
                            return false;
                        }
                        page = 1;
                        pagControl(page);
                        ClearChoice(TableID)
                        UpdateData(Object, Table, TableID, page);
                    });
                    /*上一页*/
                    var aPage = Table.find(".tablePager").find("." + TableID + "_aPage");
                    aPage.click(function () {
                        if (page == 1) {
                            return false;
                        }
                        page--;
                        pagControl(page);
                        UpdateData(Object, Table, TableID, page);
                    });
                    /*下一页*/
                    var nextPage = Table.find(".tablePager").find("." + TableID + "_nextPage");
                    nextPage.click(function () {
                        if (page == totalPage) {
                            return false;
                        }
                        page++;
                        pagControl(page);
                        ClearChoice(TableID);
                        UpdateData(Object, Table, TableID, page);
                    });
                    /*尾页*/
                    var endPage = Table.find(".tablePager").find("." + TableID + "_endPage");
                    endPage.click(function () {
                        if (page == totalPage) {
                            return false;
                        }
                        page = totalPage;
                        pagControl(page);
                        ClearChoice(TableID);
                        UpdateData(Object, Table, TableID, page);
                    });
                    /*跳页*/
                    var PageOk = Table.find(".tablePager").find("." + TableID + "_ok");
                    PageOk.click(function () {
                        JumpPage();
                    });
                    inp.keydown(function (e) {
                        if (e.keyCode == 13) {
                            JumpPage();
                        }
                    });
                    /**
                     * @return {boolean}
                     */
                    function JumpPage() {
                        var p = inp.val();
                        if (p < 1 || p > totalPage) {
                            return false;
                        }
                        page = p;
                        pagControl(page);
                        ClearChoice(TableID);
                        UpdateData(Object, Table, TableID, page);
                    }

                    /*页码按钮控制-禁用-启用*/
                    function pagControl(p) {
                        if (p > 1) {
                            aPage.css({"cursor": "pointer"});
                            firstPage.css({"cursor": "pointer"});
                        }
                        if (p == 1) {
                            aPage.css({"cursor": "not-allowed"});
                            firstPage.css({"cursor": "not-allowed"});
                        }
                        if (p < totalPage) {
                            nextPage.css({"cursor": "pointer"});
                            endPage.css({"cursor": "pointer"});
                        }
                        if (p == totalPage) {
                            nextPage.css({"cursor": "not-allowed"});
                            endPage.css({"cursor": "not-allowed"});
                        }
                    }
                    /*复选框恢复方法 先定义空方法*/
                    var ClearChoice=function (t) {/*如果开启复选功能 则有相应处理 在下面 么么哒*/};
                    pagControl(page);
                    /*页码部分 结束*/
                    if (!empty(Object.check)) {/*检查是否开启复选框 完成对应代码*/
                        if (Object.check) {
                            /*复选框控制 开始*/
                            /*行选*/
                            Table.find("." + TableID + "_td").click(function (ev) {
                                if (ev.target === this && this.parentNode.className != TableID + "_dt_head") {/*不启用表头行选*/
                                    this.parentNode.firstChild.firstChild.click();
                                }
                                if (ev.target === this && this.firstChild.className == TableID + "_dt_check_all") {/*全选所在td*/
                                    $("." + TableID + "_dt_check_all").click();
                                }
                            });
                            /*处理 复选框所在td 分开特殊处理*/
                            Table.find("." +TableID + '_td_checkbox').click(function (ev) {
                                if (ev.target === this) {
                                    this.firstChild.click();
                                }
                            });

                            /* 复选框 选择*/
                            var dt_checkbox = $("." + TableID + "_dt_checkbox");
                            dt_checkbox.click(function () {
                                var C = [];
                                var data = null;
                                var r = 0;
                                /*点选加入到数组*/
                                for (var i = 0; i < dt_checkbox.length; i++) {
                                    r = GerRowData(dt_checkbox.eq(i)[0].parentNode.nextSibling);
                                    if (dt_checkbox.eq(i)[0].checked) {
                                        data = GetJSONData[TableID][r - 2];
                                        C.push(data);
                                    }
                                }
                                if (C.length < 1) {
                                    C = null;
                                }
                                CheckData[TableID] = C;
                            });
                            /*全选*/
                            var all = 0;
                            $("." + TableID + "_dt_check_all").click(function () {
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
                            /*checked 取消选择 用于页码操作恢复*/
                            ClearChoice=function (TableID){
                                var check_all=$("." + TableID + "_dt_check_all");
                                if(check_all.is(':checked')){
                                    check_all.click();
                                }
                                var checked=$("." + TableID + "_dt_checkbox");
                                for (var i=0;i<checked.length;i++){
                                    if(checked.eq(i).is(':checked')){
                                        checked.eq(i).click();
                                    }
                                }
                            };
                            /*复选框控制 结束*/
                        }
                    }
                    /*******事件方法 开始*******/
                    Table.find("." + TableID + "_td").find(".Button").click(function () {/*自定义按钮点击方法*/
                        var button = this.getAttribute("data-button");
                        var data = GetClickRowData(this, 0, TableID);
                        /*获取绑定 参数数据 点击行*/
                        try {
                            Object[button + "Click"](data);
                        } catch (Ex) {
                            //用于处理，设置按钮但是未设置事件
                        }
                    });

                    /*定义setTimeout执行方法 解决单击双击冲突*/
                    var TimeFn = null;
                    Table.find("." + TableID + "_td").click(function (ev) {/*单击事件方法*/
                        if (empty(Object.Click)) {
                            /*未开启单击*/
                            return;
                        }
                        /*把它先储存 避免与setTimeout错乱*/
                        var t = this;
                        clearTimeout(TimeFn);
                        /*执行延时*/
                        TimeFn = setTimeout(function () {
                            if (ev.target === t && t.parentNode.className != TableID + "_dt_head") {
                                var data = GetClickRowData(t, 2, TableID);
                                /*获取绑定 参数数据 点击行*/
                                Object.Click(data);
                            }
                        }, 300);

                    });
                    Table.find("." + TableID + "_td").dblclick(function (ev) {/*双击事件方法*/
                        if (empty(Object.doubleClick)) {
                            /*未开启双击*/
                            return;
                        }
                        /*取消上次延时未执行的方法*/
                        clearTimeout(TimeFn);
                        /*双击事件的执行代码*/
                        if (ev.target === this && this.parentNode.className != TableID + "_dt_head") {
                            var data = GetClickRowData(this, 2, TableID);
                            /*获取绑定 参数数据 点击行*/
                            Object.doubleClick(data);
                        }
                    });
                    /*******事件方法 结束*******/
                } else {
                    debug("返回数据为空");
                }
            });
        }

        CreateTable(Obj, t, tid, page);
    };
    /**下面是辅助方法**/
    function empty(b) {/*检查是否设置 不存在返回true 为空为true*/
        return typeof(b) == "undefined";
    }

    /*行点击操作*/
    /*c 代表的是点谁 c用来找td t代表是区别操作类型 返回行对象*/
    /*0 是编辑删除点击处理  2是单击取数据*/
    /**
     * @return {null|[]}
     */
    function GetClickRowData(c, t, tid) {
        var row = 0;
        /*一行的所有列*/
        if (t == 0) {
            row = GerRowData(c.parentNode);
        }
        if (t == 2) {
            row = GerRowData(c);
        }

        if (row == 0) {
            return null;
        }
        /*提取数据 组装对象*/
        var RowData = GetJSONData[tid][row - 2];
        RowData.LineNumber = row;
        return RowData;
    }

    /*加载动画*/
    /**
     * @return {boolean}
     */
    function Animation(TableID, o) {
        if (!empty(TableSet[TableID].Object.loading)) {
            if (!TableSet[TableID].Object.loading) {
                return false;
            }
        }
        var table = $('#' + TableID);
        var top = table.height() / 2;
        var width = table.width();
        var height = table.height();
        var startAnimation = null;
        if (o == "start") {
            /*加载效果开始*/
            var loading = '<div id="' + TableID + '_dt_loading" style="position: absolute;left: 0;top:0;color:#232323;background:rgba(250, 250, 250, 0.7);z-index: 500;width: ' + width + 'px;height: ' + height + 'px;' +
                'text-align: center;font-size: 14px;font-family:Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,WenQuanYi Micro Hei,Microsoft Yahei,sans-serif;">' +
                '<span style="margin-top: ' + top + 'px;position: absolute;"><span class="dt_animation" style="position:relative;width:20px;height:20px;background:#232323;">3</span></span>' +
                '<span style="margin-top: ' + eval(top + 20) + 'px;position: absolute;">加载中...</span></div>';
            table.append(loading);
            var dt_animation = $(".dt_animation");
            startAnimation = function () {
                dt_animation.animate({left: 10}, "slow");
                dt_animation.animate({left: 30}, "slow");
                dt_animation.animate({left: 10}, "slow");
                dt_animation.animate({left: 0}, "slow", startAnimation);
            };
            /*启动动画*/
            startAnimation();
            /*加载效果结束*/
        }
        if (o == "stop") {
            startAnimation = null;
            $("#" + TableID + "_dt_loading").remove();//移除动画
        }
    }

    function ClearTable(t) {
        t.html("");
    }

    /*表格数据更新-页码操作 避免页码操作产生闪烁情况 则不使用清理重建*/
    function UpdateData(Object, Table, TableID, page) {
        Animation(TableID, 'start');
        var columns = Object.columns;
        var pageCapacity = Object.pageCapacity;
        $.getJSON(Object.url, {page: page, pageCapacity: pageCapacity}, function (json) {/*根据URL拉取数据*/
            var total = json.total;
            Animation(TableID, 'stop');
            json = json.rows;
            if (json != null) {
                var jsonCount = json.length;
                GetJSONData[TableID] = json;
                for (var r = 0; r < jsonCount; r++) {/*遍历行*/
                    /*table组装行*/
                    for (var c = 0; c < columns.length; c++) {/*遍历列*/
                        /*行组装列*/
                        var ColumnContent = json[r][columns[c].ColumnName];
                        /*生成一行一列 data-row= 为自定义标签用于识别行 */
                        var table_td = Table.find("tr").eq(r + 1).find("." + TableID + "_td").eq(c);
                        table_td.html(ColumnContent);
                        table_td.attr("title", ColumnContent);
                    }
                }
                var totalPage = Math.ceil(total / pageCapacity);
                $("." + TableID + "_page_tip").html("当前在第" + page + "页,总页" + totalPage + "页");
                /*数据不够表格行时，多余行隐藏*/
                if (jsonCount < pageCapacity) {
                    var poor = pageCapacity - jsonCount;
                    for (var i = 1; i <= poor; i++) {
                        Table.find("tr").eq(jsonCount + i).hide();
                    }
                } else {
                    Table.find("tr").show();
                }
            } else {
                debug("返回数据为空");
            }
        });
    }

    /*获取行号*/
    /**
     * @return {string|int}
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
    /*下面是外部绑定 调用获取参数*/
    /*获取 获取到的数组 使用ID区分*/
    /**
     * @return {null|{}}
     */
    d.fn.GetJSONArray = function () {
        var dt_id = d(this)[0].id;
        if (!empty(GetJSONData[dt_id])) {
            return GetJSONData[dt_id];
        }
        return null;
    };
    /**
     * @return {null|{}}
     */
    d.fn.GetCheckArray = function () {
        var dt_id = d(this)[0].id;
        if (!empty(CheckData[dt_id])) {
            return CheckData[dt_id];
        }
        return null;
    };
    /*上面是外部绑定 调用获取参数*/
})(jQuery);

