

let port = chrome.extension.connect({
    name: "To background from stats"
});

port.postMessage("send stats-data");

port.onMessage.addListener((msg) => {

    let heights = msg.stats;

    let dataTable = [];

    for(let i=1;i<=heights.length ;i++){
        dataTable.push([i , heights[i]]);
    }

    console.log(dataTable);


    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Day');
    data.addColumn('number', 'CO2 Emitted in grams');
   
    

    data.addRows(dataTable);

    var options = {
      chart: {
        title: 'Statistics',
        subtitle: 'This month'
      },
      width: 800,
      height: 500
    };

    var chart = new google.charts.Line(document.getElementById('linechart_material'));

    chart.draw(data, google.charts.Line.convertOptions(options));
  }

  let monthTotal = 0;

  for(let i=0 ; i<heights.length ; i++){
    monthTotal += heights[i];
  }

  let treesToBePlanted = monthTotal / 1833;

  document.getElementById("trees-h2").innerHTML = `Plant ${treesToBePlanted.toFixed(3)} trees to neutralize this month's CO2 emissions . `
    
    
});



    





