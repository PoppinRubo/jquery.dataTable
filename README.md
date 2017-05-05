jquery.dataTable
-------------
jquery 数据表格

[配置项详情](https://poppinrubo.github.io/jquery.dataTable/ "查看配置项")

![](https://poppinrubo.github.io/jquery.dataTable/images/125055_CqBH_2939922.png)  

![](https://poppinrubo.github.io/jquery.dataTable/images/125202_2Po2_2939922.png)  

`使用方法` <br>
1、引入JQ及dataTable插件
``` html

<script type="text/javascript" src="jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="jquery.dataTable.js"></script>
```
2、创建table

``` html

<table id="table"></table>
```
3、绑定设置

``` JavaScript
$("#Table").dataTable({
        debug: true,
        check: true,
        pageCapacity:15,
        loading:false,
        oddEven:false,
        url: "data.php",
        style: {"font-size": "12px", "width": "800px"},
        align:"center",
        ButtonStyle:{fontColor:"#ffffff",backgroundColor:"#10AA9C"},
        columns: [
            {ColumnName: "id", title: "ID", width: 30},
            {ColumnName: "name", title: "视频名", width: 500},
            {title: "查看", button: "show", buttonName: "查看", width: 50},
            {title: "编辑", button: "edit", buttonName: "编辑", width: 50},
            {title: "删除", button: "del", buttonName: "删除", width: 50}
        ],
        Click: function (row) {
            alert("单击："+row.id);
        },
        doubleClick: function (row) {
            alert("双击："+row.id);
        }
        ,
        editClick: function (row) {
            alert("自定义编辑："+row.id);
        }
        ,
        delClick: function (row) {
            alert("自定义删除："+row.id);
        },
        showClick: function (row) {
            alert("自定义查看："+row.name);
        }
    });
```
`关于后台数据` <br>
后台需配合插件做分页设置，插件会用get方式发送为pager的json字符串对象,后台需要解析该字符串为对象，该对象为
page : 页码
pageCapacity : 页码容量(页显示条数)
参照PHP版本可解析到对象,并处理输出

``` php

    $pager = json_decode($_GET["pager"]);
    $page=$pager->page;
    $Capacity = $pager->pageCapacity;
    $List = $DB->order('id desc')->limit($page, $Capacity)->select('video');
    $total = $DB->count('video');
    $rows = array();
    foreach ($List as $ListRow) {
        $rows[] = array(
            'id' => $ListRow['id'],
            'name' => $ListRow['name'],
        );
    }
    $data = array('total' => $total, 'rows' => $rows);
echo json_encode($data);
```
Java版本(mysql)<br>
``` java

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		JdbcHelper db = new JdbcHelper();
		//get获取json字符串对象
		String  pager= request.getParameter("pager");
		//字符串转换为对象
		JSONObject jsonObject = JSONObject.fromObject(pager);
		//提取参数
		int page=jsonObject.getInt("page");
		int pageCapacity=jsonObject.getInt("pageCapacity");
		//简单处理分页
		int p=(page-1)*pageCapacity;
		String sql="select * from video order by id desc limit "+p+","+pageCapacity+"";	
		JSONArray jsonArray = JSONArray.fromObject(db.query(sql,null, null));//list转换json字符串
		String sqlcount="select * from video";
		int total=db.queryCount(sqlcount,null, null);
		String json="{"+"\"total\":"+total+",\"rows\":"+jsonArray+"}";//格式拼接
		out.print(json);
		out.flush();
		out.close();
	}
```
以上示例仅供参考,不建议直接使用在项目。对于分页可自行封装
<br>
<br>
返回的json格式(total:数据总条数,并非页数)
``` JavaScript

{
  "total": 3744,
  "rows": [
    {
      "id": 3832,
      "name": "Haeni Kim- Falling For Someone New - Kuma"
    },
    {
      "id": 3831,
      "name": "Top Moments- A Friday Night vol. 100 (Korea)"
    },
    {
      "id": 3830,
      "name": "WAACKXXY Waacking 2017"
    },
    {
      "id": 3829,
      "name": "TRIX a.k.a. EYE X Krump 2017"
    }
  ]
}
```

### [查看demo](http://120.24.216.26/dataTable/ "查看demo")
