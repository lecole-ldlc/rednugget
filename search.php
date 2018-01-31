<?php
define('DB_NAME', 'get_rednugget');
define('DB_USER', 'antoine_GRN');
define('DB_PASSWORD', 'C~rvm162');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');

?>

<?php

/**
 * Created by PhpStorm.
 * User: antoine
 * Date: 25/01/18
 * Time: 09:31
 */

$limit = 5;

class Channel
{
    public $id;
    public $duration = 0.0;
    public $subscribers = 0.0;
    public $frequency = 0.0;
    public $humor = 0.0;
    public $reflection = 0.0;
    public $originality = 0.0;
    public $tags = array();

    public $channel_fullname = "";
    public $channel_name = "";
    public $channel_URL = "";
    public $channel_description = "";
    public $channel_subscribers = 0;
    public $channel_views = 0;
    public $channel_video_count = 0;
    public $channel_creationdate;
    public $channel_average_videotime = 0;
    public $channel_language = "";
    public $channel_type = "";
    public $post_URL = "";
    public $post_thumbnail_URL = "";
    public $channel_facebookURL = "";
    public $channel_twitterURL = "";
    public $channel_snapchatURL = "";
    public $channel_instagramURL = "";
    public $channel_websiteURL = "";
    public $distance = 1000;

    public function __toString()
    {
        return $this->channel_name;
    }
}

$params = array("d" => null, "s" => null, "f" => null, "h" => null, "r" => null, "o" => null);
$params_enable = array("d" => true, "s" => true, "f" => true, "h" => true, "r" => true, "o" => true);
$params_indir = array("d" => "duration", "s" => "subscribers", "f" => "frequency", "h" => "humor", "r" => "reflection", "o" => "originality");
$tags = array();

foreach ($params as $p => $v) {
    if (isset($_GET[$p])) {
        $params[$p] = floatval($_GET[$p]);
    } else {
        $params_enable[$p] = false;
        $params[$p] = 0.5;
    }
}

if (isset($_GET['tags'])) {
    $tags = explode(",", $_GET['tags']);
}

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
}
$conn->set_charset('utf8');


function compute_distance($c)
{
    global $params, $params_enable, $params_indir;
    $tot = 0.0;
    foreach ($params as $p => $v) {
        if ($params_enable[$p]) {
            $f = $params_indir[$p];
            $tot += pow($c->$f - $v, 2);
        }
    }
    return $tot;
}

function comp_channels($a, $b)
{
    return $a->distance > $b->distance;
}


$all_channels = array();

$result = $conn->query("SELECT *  FROM channel_informations WHERE 1");
if (!$result) {
    die($conn->error);
}
while ($row = $result->fetch_assoc()) {
    $c = new Channel();
    $c->id = $row["ID"];
    $c->duration = floatval($row["duration_rating"]);
    $c->subscribers = floatval($row["subscribers_rating"]);


    $c->channel_fullname = $row["channel_fullname"];
    $c->channel_name = $row["channel_name"];
    $c->channel_URL = $row["channel_URL"];
    $c->channel_subscribers = intval($row["channel_subscribers"]);
    $c->channel_views = intval($row["channel_views"]);
    $c->channel_video_count = intval($row["channel_video_count"]);
    $c->channel_creationdate;
    $c->channel_average_videotime = intval($row["channel_average_videotime"]);
    $c->channel_language = intval($row["channel_language"]);
    $c->channel_type = intval($row["channel_type"]);
    $c->post_URL = $row["post_URL"];
    $c->post_thumbnail_URL = $row["post_thumbnail_URL"];
    $c->channel_facebookURL = $row["channel_facebookURL"];
    $c->channel_twitterURL = $row["channel_twitterURL"];
    $c->channel_snapchatURL = $row["channel_snapchatURL"];
    $c->channel_instagramURL = $row["channel_instagramURL"];
    $c->channel_websiteURL = $row["channel_websiteURL"];
    $c->channel_description = $row["channel_description"];
    $c->distance = 1000;

    $all_channels[$c->id] = $c;
}

$result = $conn->query("SELECT ID_channel_name, AVG(humor_rating), AVG(reflection_rating), AVG(originality_rating) FROM rednugget_rating WHERE 1 GROUP BY ID_channel_name");
if (!$result) {
    die($conn->error);
}
while ($row = $result->fetch_array()) {
    $id = $row[0];
    $c = $all_channels[$id];
    $c->humor = $row[1];
    $c->reflection = $row[2];
    $c->originality = $row[3];
    $c->distance = compute_distance($c);
}

$result = $conn->query("SELECT channel_tag.ID_channel, tag.tag_name  FROM tag, channel_tag WHERE channel_tag.ID_tag = tag.ID");
if (!$result) {
    die($conn->error);
}
while ($row = $result->fetch_array()) {
    $id = $row[0];
    array_push($all_channels[$id]->tags, $row[1]);
}

usort($all_channels, comp_channels);
$channels = array_splice($all_channels, 0, $limit);

header("Access-Control-Allow-Origin: *");
?>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Nugget Lab</title>
    <link rel="shortcut icon" type="image/x-icon" href="../../../../Applications/MAMP/htdocs/rednugget/favicon.ico">


    <!-- Google fonts & CSS-->
    <link href="https://fonts.googleapis.com/css?family=Exo" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Dosis" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
          crossorigin="anonymous">
    <link href="../../../../Applications/MAMP/htdocs/rednugget/main.css" rel="stylesheet" type="text/css">

    <!-- D3 -->
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <style></style>
    <!-- Popper -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js"
            integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh"
            crossorigin="anonymous"></script>
    <!-- JQuery -->
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"
            integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <!-- Bootstrap -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
            crossorigin="anonymous"></script>
    <!-- RadarChart -->
    <script src="../../../../Applications/MAMP/htdocs/rednugget/radarChart_v4.js"></script>
</head>

<body cz-shortcut-listen="true">

<h1>NuggetLab</h1>
<hr style="border-top: 1px solid rgba(0,0,0,0.1); padding-bottom: 0px; margin-bottom: 0px; padding-top: 0px; margin-top: 0px">

<div class="row">

    <div class="col-sm-12 col-lg-4">
        <div id="CYN">
        </div>
        <button id="GetNugget" class="btn btn-primary">Go !</button>
        <button id="reset" class="btn btn-primary">Recommencer</button>
    </div>

    <div class="col-lg-8" style="border-left: 1px solid rgba(0,0,0,0.1); padding-top: 0px; padding-left: 0px;">
        <div>
            <?php
            $pos = 1;
            foreach ($channels as $key => $value) {
                ?>
                <div class="row">
                    <div style="float: left; margin-right: 50px">
                        <p id="result<?php if ($pos > 1) {
                            echo($pos);
                        } ?>">
                            <br>
                            <a target="_blank" href="<?php echo($value->post_URL) ?>"><img
                                        class="nugget_img"
                                        src="<?php echo($value->post_thumbnail_URL) ?>"></a>
                        </p>
                    </div>
                    <div>
                        <h3 id="fullname" style="margin-top: 10px"><?php echo($value->channel_fullname) ?></h3><br>
                        <p id="desc"><?php echo($value->channel_description) ?></p><br>
                    </div>
                </div>
                <?php
                $pos++;
            }
            ?>
        </div>
    </div>

</div>

<script>

    function topFunction() {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
    }
    var sm_ids = 1;

    // Array that stores the input from the user
    var data_slider = [
        [
            {axis: "Humour", value: <?php echo($params["h"]) ?>},
            {axis: "Durée", value: <?php echo($params["d"]) ?>},
            {axis: "Abonnés", value: <?php echo($params["s"]) ?>},
            {axis: "Fréquence", value: <?php echo($params["f"]) ?>},
            {axis: "Réflexion", value: <?php echo($params["r"]) ?>},
            {axis: "Originalité", value: <?php echo($params["o"]) ?>}
        ]
    ];

    var margin = {top: 5, right: 5, bottom: 10, left: 5},
        width = Math.min(400, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20); // Configuration for small multiples


    var customMargin = {top: 30, right: 60, bottom: 80, left: 60},
        width = Math.min(400, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20); // Configuration for Builder


    //////////////////////////////////////////////////////////////
    //////////////////// Draw the Chart //////////////////////////
    //////////////////////////////////////////////////////////////
    var color = d3.scaleOrdinal()
        .range(["#f43131", "#353535", "#f9f9f9", "#14649F", "#6F835A", "#8B7E66", "#8B2252"]); // Only the first color is relevant for now
    var color2 = d3.scaleOrdinal()
        .range(["#353535", "#353535", "#f9f9f9", "#14649F", "#6F835A", "#8B7E66", "#8B2252"]);


    var customRadarChartOptions = { // Options for the builder
        w: width * 0.7,
        h: height * 0.7,
        dotRadius: 9,
        margin: customMargin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: color,
        showLabel: true,
        enableDrag: true
    };

    $(function () {
        RadarChart("#CYN", data_slider, "", null, customRadarChartOptions); // Create the builder
    });

    $("#reset").click(function () {
        data_slider = [ // Default
            [
                {axis: "Humour", value: 0.5},
                {axis: "Durée", value: 0.5},
                {axis: "Abonnés", value: 0.5},
                {axis: "Fréquence", value: 0.5},
                {axis: "Réflexion", value: 0.5},
                {axis: "Originalité", value: 0.5}
            ]
        ];
        $('#CYN').html(''); // Kill builder
        RadarChart("#CYN", data_slider, "", "", customRadarChartOptions); // Redraw builder
        //console.log(data_slider)
    });

    $("#GetNugget").on("click", function () {
        //var url = "https://get.rednugget.fr/search.php?";
        var url = "http://localhost:8888/rednugget/search.php";
        url += "?h=" + (enable_axes[0] ? data_slider[0][0].value.toFixed(2) : "")
        url += "&d=" + (enable_axes[1] ? data_slider[0][1].value.toFixed(2) : "")
        url += "&a=" + (enable_axes[2] ? data_slider[0][2].value.toFixed(2) : "")
        url += "&f=" + (enable_axes[3] ? data_slider[0][3].value.toFixed(2) : "")
        url += "&r=" + (enable_axes[4] ? data_slider[0][4].value.toFixed(2) : "")
        url += "&o=" + (enable_axes[5] ? data_slider[0][5].value.toFixed(2) : "")
        console.log(url);
        window.location = url;
    });

    var tooltip = d3.select('body').append("div")
        .attr("class", "tooltip_radar tooltip")
        .style("opacity", 0);

    var enable_axes = [true, true, true, true, true, true];
</script>

</body>
</html>
