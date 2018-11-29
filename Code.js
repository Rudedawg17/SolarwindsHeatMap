<!--#################################################
# This one is the breakdown with click to load data #
# Use this one to only show MachineType & Vendor.   #
#####################################################-->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<div>
<script>

	var swql="SELECT SUBSTRING(TOSTRING(DATETRUNC('Day',TimeStamp)),0,12) AS Day ,COUNT(*) AS Qty FROM Orion.AlertHistory WHERE TOLOCAL(TimeStamp) > GETDATE()-177 GROUP BY DATETRUNC('Day',TimeStamp)ORDER BY DATETRUNC('Day',TimeStamp) DESC"

	var params = JSON.stringify({
		query: swql,
		parameters: {
		}
	});
	
	$.ajax({
		type: 'POST',
		url: '/Orion/Services/Information.asmx/QueryWithParameters',
		data: params,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(response) {
			
			var i;
			
			google.charts.load("current", {packages:["calendar"]}).then(function () {

				var dataTable = new google.visualization.DataTable();
				dataTable.addColumn({ type: 'date', id: 'Date' });
				dataTable.addColumn({ type: 'number', id: 'Changes' });

				for(var i=0; i < response.d.Rows.length; i++){
					var row = [new Date(response.d.Rows[i][0]),response.d.Rows[i][1]];
					dataTable.addRow(row);
				}
				
				var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
			
				var options = {
				title: 'Total Alerts Triggered By Day',
				calendar: { cellSize: 25 },
				colorAxis: {colors:['#86ce76','#d61007']},
				};
			
				<!--Event listener starting code-->
				function selectHandler(initialDate) {
					var selectedItem;
					var selected = initialDate || chart.getSelection();
					if (selectedItem.length > 0) {
						console.log(new Date(selectedItem[0].date));
						selectedItem = selection[0];
					}
					if (selectedItem) {
						var dateindex=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
						var longdate = dataTable.getValue(selectedItem.row, 0);
						var splitdate=longdate.toString().split(" ");
						var querymonth= dateindex.indexOf(splitdate[1])+1;
						var querydate=splitdate[2];
						console.log(querymonth);
						
						<!--this is where i might have broke it--->
						
						var swql="SELECT SUBSTRING(TOSTRING(DATETRUNC('Day',TimeStamp)),0,12) AS Day ,COUNT(*) AS Qty,ISNULL(AlertHistory.AlertObjects.Node.MachineType,'Unknown') AS MachineType FROM Orion.AlertHistory WHERE YEAR(TOLOCAL(TimeStamp)) = YEAR(GETDATE()) AND MONTH(TOLOCAL(TimeStamp)) = " +querymonth + " AND DAY(TOLOCAL(TimeStamp)) = " +querydate+" GROUP BY DATETRUNC('Day',TimeStamp),AlertHistory.AlertObjects.Node.MachineType ORDER BY DATETRUNC('Day',TimeStamp) DESC,QTY DESC"
						
						var params = JSON.stringify({
							query: swql,
							parameters: {
							}
						});
						
						$.ajax({
							type: 'POST',
							url: '/Orion/Services/Information.asmx/QueryWithParameters',
							data: params,
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							success: function(response) {
								console.log(response.d.Rows);
								
								<!--begin category_pi2 chart code-->>
								google.charts.load("current", {packages:["corechart"]});
								google.charts.setOnLoadCallback(drawChart);
								
								function drawChart() {
									var dataTable = new google.visualization.DataTable();
									dataTable.addColumn({ type: 'string', id: 'Event Type' });
									dataTable.addColumn({ type: 'number', id: 'Count' });
									
									for(var i=0; i < response.d.Rows.length; i++){
										var row = [response.d.Rows[i][2],response.d.Rows[i][1]];
										dataTable.addRow(row);
									}
									
									var chart = new google.visualization.PieChart(document.getElementById('category_pi2'));
									
									var options = {
										title: longdate.toString().slice(0,15) + ' Machine Type',
										calendar: { cellSize: 30 },
										colorAxis: {colors:['#86ce76','#d61007']},
									};
									
									chart.draw(dataTable, options);
								}
								<!--end category_pi2 chart code-->>
							}
						})
						
						var swql="SELECT SUBSTRING(TOSTRING(DATETRUNC('Day',TimeStamp)),0,12) AS Day ,COUNT(*) AS Qty,ISNULL(AlertHistory.AlertObjects.Node.Vendor,'Unknown') AS Vendor FROM Orion.AlertHistory WHERE YEAR(TOLOCAL(TimeStamp)) = YEAR(GETDATE()) AND MONTH(TOLOCAL(TimeStamp)) = " + querymonth + " AND DAY(TOLOCAL(TimeStamp)) = " + querydate + " GROUP BY DATETRUNC('Day',TimeStamp),AlertHistory.AlertObjects.Node.Vendor ORDER BY DATETRUNC('Day',TimeStamp) DESC,QTY DESC"
						
						var params = JSON.stringify({
							query: swql,
							parameters: {
							}
						});
						
						$.ajax({
							type: 'POST',
							url: '/Orion/Services/Information.asmx/QueryWithParameters',
							data: params,
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							success: function(response) {
								console.log(response.d.Rows);
								
								<!--begin category_pi3 chart code-->>
								google.charts.load("current", {packages:["corechart"]});
								google.charts.setOnLoadCallback(drawChart);

								function drawChart() {
									var dataTable = new google.visualization.DataTable();
									dataTable.addColumn({ type: 'string', id: 'Event Type' });
									dataTable.addColumn({ type: 'number', id: 'Count' });
									
									for(var i=0; i < response.d.Rows.length; i++){
										var row = [response.d.Rows[i][2],response.d.Rows[i][1]];
										dataTable.addRow(row);
									}
									
									var chart = new google.visualization.PieChart(document.getElementById('category_pi3'));
									
									var options = {
										title: longdate.toString().slice(0,15) + ' Vendor',
										calendar: { cellSize: 30 },
										colorAxis: {colors:['#86ce76','#d61007']},
									};
									
									chart.draw(dataTable, options);
								}
								<!--end category_pi3 chart code-->>
							}
						})
						<!--this ends where i might have broke it--->
					}
				}
				
				google.visualization.events.addListener(chart, 'select', selectHandler);
				<!--End event listener-->
				
				google.visualization.events.addOneTimeListener(chart, 'ready', function () {
					selectHandler([{date: (new Date).getTime()}]);
				});
				<!--Initial Selection Call-->
				
				chart.draw(dataTable, options);
			)};
		}
	})
</script>
</div>
<!--Adding some divs here for layout management  all divs will be sized relevant to the container-->
<div id="container" style width:2000px; height:100%>
<div id="calendar_basic" style="width: 100%; height: 450px;"></div>
<div id="category_pi2" style="width: 50%; height 300px; float:left;"></div>
<div id="category_pi3" style="width: 50%; height 300px; float:right;"></div>
</div>
