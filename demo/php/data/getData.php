<?php
include_once('class/DB.php');
function getVideoList()
{/*拉取数据*/
    $DB = new DB();
    $page = $_POST["page"];
    $Capacity = $_POST["pageCapacity"];
    $Query = null;
    if (isset($_GET["search"])) {
        $Query = $_GET["search"];
    }
    $List = $DB->order('AmountID desc')->limit($page, $Capacity)->select('show_info');
    $total = $DB->count('show_info');
    if ($Query != null && $Query != "") {
        $total = $DB->where("material like '%$Query%'")->count('show_info');
        $List = $DB->order('AmountID desc')->where("material like '%$Query%'")->limit($page, $Capacity)->select('show_info');
        if (is_numeric($Query)) {
            $total = $DB->where(array("AmountID" => $Query))->count('show_info');
            $List = $DB->order('AmountID asc')->where(array("AmountID" => $Query))->limit($page, $Capacity)->select('show_info');
        }
    }
    $rows = array();
    foreach ($List as $ListRow) {
        $rows[] = array(
            'id' => $ListRow['AmountID'],
            'ip' => $ListRow['ip'],
            'material' => $ListRow['material'] == null ? "无" : $ListRow['material'],
            'time' => $ListRow['PlayData'],
        );
    }
    /*返回数据*/
    echo json_encode(array('total' => $total, 'rows' => $rows));
}

getVideoList();
