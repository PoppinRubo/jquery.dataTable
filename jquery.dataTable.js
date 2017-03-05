/***DataTable的封装 by PoppinRubo****************开始了***************/
/*选择行 对象*/
var RowData = {};
(function (d) {/*使用之前记得要引入JQ*/
    /*调试模式,默认关闭*/
    var DebugMsg = false;
    /*记住当前表格,全局用于跨方法*/
    var T = null;
    /**
     * @return {boolean}
     */
    d.fn.DataTable = function (Object) {/*使用table绑定 用ID 或class 建议使用ID*/
        /*d是传进来的元素 d(this)就是这个table*/
        var Table = d(this);
        T = Table;
        /*URl 方式创建DataTable 该链接返回的数据为json格式*/
        var url = Object.url;
        if (bind(Object.debug)) {/*是否开启调试模式*/
            DebugMsg = Object.debug;
        }
        if (!bind(url)) {/*检查是否绑定URL*/
            debug("未绑定url");
            return false;
        }
        /*加载效果开始*/
        // var loading = '<div id="spinner" style="  margin: 100px auto;width: 50px;height: 60px;text-align: center;font-size: 10px;">' +
        //     '<div class="rect1"></div>' +
        //     '<div class="rect2"></div>' +
        //     '<div class="rect3"></div>' +
        //     '<div class="rect4"></div>' +
        //     '<div class="rect5"></div>' +
        //     '</div>';
        // $("#spinner").find("div").css({
        //     "background-color":" #67CF22",
        //     "height": "100%",
        //     "width": "6px",
        //     "display": "inline-block",
        //     "-webkit-animation": "stretchdelay 1.2s infinite ease-in-out",
        //     "animation": "stretchdelay 1.2s infinite ease-in-out"
        // });
        // Table.append(loading);
        // var css = document.createElement('style');/*创建style标签*/
        // css.type='text/style';
        // css.text='.selector{attr:value;}';
        // document.getElementsByTagName('head')[0].appendChild(css);/*在head插入style标签 用于插入css3代码*/
        // document.getElementsByTagName("style")[0].innerHTML+="@-webkit-keyframes stretchdelay {0%, 40%, 100% { -webkit-transform: scaleY(0.4) }20% { -webkit-transform: scaleY(1.0) }}"+
        // "@keyframes stretchdelay {0%, 40%, 100% {transform: scaleY(0.4);-webkit-transform: scaleY(0.4);}  20% { transform: scaleY(1.0);-webkit-transform: scaleY(1.0);}}";

        /*加载效果结束*/
        var columns = Object.columns;
        if (!bind(columns)) {/*检查是否绑定表格配置*/
            debug("未绑定columns");
            return false;
        }
        /*生成表头*/
        /*插入表头行*/
        Table.append("<tr id='dt_head'></tr>");
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
            if (check[0]) {
                Table.find("tr").eq(0).prepend("<td title='全选' style='width:25px'><input id='dt_check_all' type='checkbox'></td>");
            }
        }
        $.getJSON(url, function (json) {/*根据URL拉取数据*/
            if (json.length) {
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
                            var DataBind = Object.columns[c]["bind"];
                            /*检查是否设置绑定的字段*/
                            if (!bind(DataBind)) {
                                debug("未设置绑定字段");
                                return false;
                            }
                            var DataID = json[r][DataBind];
                            if (facility == "edit") {
                                ColumnContent = "<span data-id='" + DataID + "' class='dt_edit'>编辑</span>";
                                ColumnTitle = "编辑";
                            }
                            if (facility == "del") {
                                ColumnContent = "<span data-id='" + DataID + "' class='dt_del'>删除</span>";
                                ColumnTitle = "删除";
                            }

                        }
                        /*生成一行一列 data-obj 为自定义标签用于储存对象 key*/
                        var obj_key = [columns[c].ColumnName];
                        Table.find("tr").eq(r + 1).append("<td data-obj='" + obj_key + "' title='" + ColumnTitle + "'>" + ColumnContent + "</td>");
                    }
                    if (bind(check)) {/*检查是否开启复选框 绑定行*/
                        if (check[0]) {
                            Table.find("tr").eq(r + 1).prepend("<td><input class='dt_checkbox' type='checkbox'></td>");
                        }
                    }
                }
                /*Table样式*/
                Table.css({
                    "border-collapse": "collapse",
                    "font-family": '"Microsoft YaHei", "微软雅黑", helvetica, arial, verdana, tahoma, sans-serif',
                    "font-size": "14px",
                    "table-layout": "fixed"
                });
                Table.find("td").css({
                    "border": "1px solid #d8d8d8",
                    "padding": "5px",
                    "overflow": "hidden",
                    "white-space": "nowrap",
                    "cursor": "pointer",
                    "text-align": "left",
                });
                Table.find(".dt_checkbox,#dt_check_all").css({
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
                    "z-index":"100"
                });
                var ButtonColor = Object.ButtonColor;
                if (bind(ButtonColor)) {
                    Table.find("td span").css({"background": ButtonColor});
                }
                Table.find("tr").hover(function () {
                    if (this.id != "dt_head") {
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
                /*复选框控制 开始*/
                /*行选*/
                Table.find("td").click(function (ev) {
                    if (ev.target === this&&this.parentNode.id!="dt_head") {/*防止事件错乱，并且不启用表头行选*/
                        this.parentNode.firstChild.firstChild.click();
                    }
                });
                /*点选*/
                var dt_checkbox = $(".dt_checkbox");
                dt_checkbox.click(function (ev) {
                    /*获取该行所有列*/
                    var TdNode = this.parentNode.parentNode.children;

                    /*遍历提取对象*/
                    for (var t = 0; t < TdNode.length; t++) {
                        var key = TdNode[t].getAttribute("data-obj");
                        if (key != null && key != "") {
                            RowData[key] = TdNode[t].innerText;
                        }
                    }


                });
                /*全选*/
                var all = 0;
                $("#dt_check_all").click(function () {
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
                function editClick() {
                    $(".dt_edit").click(function () {/*编辑点击方法*/
                        var data=TableGetVal(this);/*获取绑定 参数数据 点击行*/
                        alert(data);
                    });
                }
                $(".dt_del").click(function () {/*删除点击方法*/
                    var data=TableGetVal(this);/*获取绑定 参数数据 点击行*/
                });
            } else {
                debug("返回数据为空");
            }
        });

    };
    /**下面是辅助方法**/
    function bind(b) {/*检查是否有绑定功能*/
        return typeof(b) != "undefined";
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
/*外部调用方法*/
/**
 * @return {string}
 */
function TableGetVal(t) {

    return t.getAttribute("data-id");
}
function GetRowData() {
    return RowData;
}
/***DataTable的封装 by PoppinRubo****************结束了***************/
