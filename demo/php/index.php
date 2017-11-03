<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DataTable插件,demo</title>
    <link rel="shortcut icon" href="favicon.ico"/>
    <link rel="stylesheet" type="text/css" href="css/buttons.css">
    <style type="text/css">
        p {
            width: 100%;
            height: 30px;
            font-family: "微软雅黑", serif;
            font-size: 14px;
            text-align: center;
            color: #000000;
        }

        header {
            position: absolute;
            margin: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            background: #f2f2f2;
        }

        header datatable {
            height: 100%;
            line-height: 50px;
            margin: 0 30px;
            font-family: "Microsoft YaHei", "微软雅黑", helvetica, arial, verdana, tahoma, sans-serif;
            font-size: 24px;
        }

        .search input {
            width: 150px;
            height: 20px;
            margin: 6px;
            border-radius: 10px;
            padding-left: 10px;
            border: 1px solid rgb(216, 216, 216);
            outline: none;
        }

        .search a {
            padding: 0 5px 2px 5px;
            border-radius: 3px;
            text-decoration: none;
            background: #232323;
            color: #FFFFFF;
            font-family: "Microsoft YaHei", "微软雅黑", helvetica, arial, verdana, tahoma, sans-serif;
            font-size: 14px;
        }
    </style>
</head>
<body>
<header>
    <datatable>
        DataTable
    </datatable>
</header>
<button class="button button-primary button-pill button-small"
        onclick="alert( JSON.stringify($('#Table').GetJSONArray()));" style="position: relative;left: 0;top:80px;">
    获取表格一当页返回数据
</button>
<p>表格示例一(生成序号、生成选中行标记、创建按钮、自定义颜色为青蓝色)</p>
<div style="position: relative;margin: 10px auto;width:850px;height: 500px;overflow-y:auto;overflow-x:hidden;">
    <table id="Table"></table>
</div>
<div style="position: relative;left: 0;top:150px;width: 300px;">
    <button class="button button-primary button-pill button-small"
            onclick="alert( JSON.stringify($('#Table2').GetJSONArray()));">获取表格二当页返回数据
    </button>
    <button class="button button-primary button-pill button-small"
            onclick="alert( JSON.stringify($('#Table2').GetCheckArray()));" style="margin: 20px 0">获取表格二check选中行
    </button>
</div>
<p>表格示例二(双击事件、单击事件、搜索、复选框、自定义颜色为炭黑色)</p>
<p class="search"><input id="query" placeholder="输入地区,或ID进行搜索"><a id="search" href="JavaScript:void(0);">搜索</a></p>
<div style="position: relative;margin: 0 auto;width:850px;height: 500px;overflow-y:auto;overflow-x:hidden;">
    <table id="Table2"></table>
</div>
</body>
<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="js/jquery.dataTable.js"></script>
<script type="text/javascript">
    /****************搜索开始*******************/
    $(function () {
        $("#query").bind('keypress', function (event) {
            if (event.keyCode == "13") {
                search();
            }
        });
        $("#search").click(function () {
            search();
        });

    });
    function search() {
        $("#Table2").dataTable({
            url: "data/getData.php?search=" + encodeURI($("#query").val())
        });
    }
    /****************搜索结束*******************/
    $("#Table").dataTable({
        debug: true,
        method: "get",
        check: false,
        pageCapacity: 15,
        loading: true,
        sign: true,
        url: "data/getData.php",
        style: {"font-size": "12px", "width": "800px"},
        align: "center",
        ButtonStyle: {fontColor: "#ffffff", backgroundColor: "#10AA9C"},
        columns: [
            {ColumnName: "id", title: "ID", width: 40},
            {ColumnName: "ip", title: "IP地址", width: 80},
            {ColumnName: "material", title: "IP信息", width: 300},
            {ColumnName: "time", title: "时间", width: 120},
            {title: "编辑", button: "edit", buttonName: "编辑", width: 50},
            {title: "删除", button: "del", buttonName: "删除", width: 50}
        ],
        editClick: function (row) {
            alert("表格1 编辑：ip " + row.ip);
        }
        ,
        delClick: function (row) {
            alert("表格1 删除：ip " + row.ip);
        },
        addClick: function (row) {
            alert("表格1 自定义：添加 " + row.ip);
        }
    });
    $("#Table2").dataTable({
        debug: true,
        method: "get",
        serial: false,
        check: true,
        pageCapacity: 15,
        loading: true,
        sign: false,
        url: "data/getData.php",
        style: {"font-size": "12px", "width": "800px"},
        align: "center",
        ButtonStyle: {fontColor: "#ffffff", backgroundColor: "#232323"},
        columns: [
            {ColumnName: "id", title: "ID", width: 40},
            {ColumnName: "ip", title: "IP地址", width: 100},
            {ColumnName: "material", title: "IP信息", width: 300},
            {ColumnName: "time", title: "时间", width: 120}
        ],
        Click: function (row) {
            alert("你单击了ID为 " + row.id + "的行");
        },
        doubleClick: function (row) {
            alert("你双击了ID为 " + row.id + "的行");
        }
    });
</script>
</html>
