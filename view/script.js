const main = document.getElementById("table");
const select = document.getElementById("idProj");

async function start(){
   let res = await fetch("/getIds",{method:"GET"});
   let ids = await res.json();
   let test='<option value="no"selected></option>';   
   //console.log(ids);
   for(id of ids){
      test+=`<option value='${id.idYandex}_${id.idTopVisor}'>${id.name}</option>`;
   }
   select.innerHTML = test;
}

//даты пускай здесь полежат
var d = new Date();
var now = formatDate(d);
var startDate = now;
var endDate = now;

async function getData(start, end){
   if(select.value=="no"){console.log("nononono");return;}
   console.log(); 
   let dates = {
      idYandex: select.value.split("_")[0],
      idTopVisor:select.value.split("_")[1],
      dateForSource:{
         start:startDate,
         end:endDate
      },
      dateForTraffic:{
         start:startDate,
         end:endDate
      },
      dateForPhrase:{
         start:startDate,
         end:endDate,
         minValue:0
      },
      dateForDevice:{
         start:startDate,
         end:endDate,
      },
      dateForSearchEngine:{
         start:startDate,
         end:endDate,
      },
      dateForConversion:{
         start:startDate,
         end:endDate,
      }
   };
   let data = await (await fetch("/getData",{
      method: 'POST',
      headers: {
         'Accept': 'application/json, text/plain, */*',
         'Content-Type': 'application/json'
      },
      body:JSON.stringify(dates)
   })).json();
   console.log(data);
   

	//перенос переменных
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/*var myString = "";
	for (let i = 0; i < data.device.length; i++) {
		myString += JSON.stringify(data.device[i].name);
	}
	document.getElementById("demo").innerHTML = myString;*/
	
	//диаграмма - посещаемость
	var sum = Number(data.searchEngine[0].visits) + Number(data.searchEngine[1].visits);
	var googlePerc = Number(data.searchEngine[0].visits) / sum * 100;
	var yandexPerc = Number(data.searchEngine[1].visits) / sum * 100;
	var myString = "";
	myString += '<div style="--pie-p1:';
	myString += JSON.stringify(googlePerc);
	myString += '%; --pie-p2:';
	myString += JSON.stringify(yandexPerc);
	myString += '%;"></div>';
	document.getElementById("attendance").innerHTML = myString;
	document.getElementById("googlePerc").innerHTML = 'Google - ' + googlePerc.toFixed(1) +'%';
	document.getElementById("yandexPerс").innerHTML = 'Яндекс - ' + yandexPerc.toFixed(1) +'%';
	
	//диаграмма - трафик (прямые заходы и т.д.)
	var sum = Number(data.source[0].visits) + Number(data.source[1].visits);
	var rightEnter = Number(data.source[0].visits) / sum * 100;
	var anotherEnter = Number(data.source[1].visits) / sum * 100;
	var myString = "";
	myString += '<div style="--pie-p1:';
	myString += JSON.stringify(rightEnter);
	myString += '%; --pie-p2:';
	myString += JSON.stringify(anotherEnter);
	myString += '%;"></div>';
	document.getElementById("trafficEnter").innerHTML = myString;
	document.getElementById("rightEnter").innerHTML = 'Прямые заходы - ' + rightEnter.toFixed(1) +'%';
	document.getElementById("anotherEnter").innerHTML = 'Переходы из поисковых систем - ' + anotherEnter.toFixed(1) +'%';
	
	//диаграмма - девайсы
	var sum = Number(data.device[0].visits) + Number(data.device[1].visits) + Number(data.device[2].visits);
	var phone = Number(data.device[0].visits) / sum * 100;
	var pc = Number(data.device[1].visits) / sum * 100;
	var tablet = Number(data.device[2].visits) / sum * 100;
	var myString = "";
	myString += '<div style="--pie-p1:';
	myString += JSON.stringify(phone);
	myString += '%; --pie-p2:';
	myString += JSON.stringify(pc);
	myString += '%; --pie-p3:';
	myString += JSON.stringify(tablet);
	myString += '%;"></div>';
	document.getElementById("device").innerHTML = myString;
	document.getElementById("phone").innerHTML = 'Смартфоны - ' + phone.toFixed(1) +'%';
	document.getElementById("pc").innerHTML = 'ПК - ' + pc.toFixed(1) +'%';
	document.getElementById("tablet").innerHTML = 'Планшеты - ' + tablet.toFixed(1) +'%';
	
	//диаграмма Вывод в ТОП-10
	//Google
	var topGooglePerc = data.topsTopvisor[1].numberOfSearchresultTop;
	var myString = "";
	myString += '<div style="--pie-p1:';
	myString += JSON.stringify(topGooglePerc);
	myString += '%;"></div>';
	document.getElementById("topGooglePerc").innerHTML = myString;
	document.getElementById("topGoogle").innerHTML = 'Google - ' + topGooglePerc.toFixed(1) +'%';
	//Яндекс
	var topYandexPerc = data.topsTopvisor[0].numberOfSearchresultTop;
	var myString = "";
	myString += '<div style="--pie-p1:';
	myString += JSON.stringify(topYandexPerc);
	myString += '%;"></div>';
	document.getElementById("topYandexPerc").innerHTML = myString;
	document.getElementById("topYandex").innerHTML = 'Яндекс - ' + topYandexPerc.toFixed(1) +'%';
	
	//столбчатая диаграмма по ТРАФИКУ
	//вытаскиваем значения из объекта
	let arrayTraffic = [['Дата', 'Визиты'],];
	for (let i = 0; i < data.traffic.length; i++) {
		arrayTraffic.push([data.traffic[i].interval[0], data.traffic[i].visits]);
	}
	//рисуем диаграмму
	google.load("visualization", "1", {packages:["corechart"]});
	google.setOnLoadCallback(drawChartTraffic);
	function drawChartTraffic() {
		var data = google.visualization.arrayToDataTable(arrayTraffic);
		var options = {
			//title: 'Визиты',
			//title: 'Пользователи',
			//hAxis: {title: 'Дата'},
			//vAxis: {title: 'Число'}
		};
		var chart = new google.visualization.ColumnChart(document.getElementById('trafficChart'));
		chart.draw(data, options);
	}
	
	//столбчатая диаграмма по КОНВЕРСИЯМ
	//вытаскиваем значения из объекта
	let arrayConvers = [['Действие', 'Конверсия %'],];
	for (let i = 0; i < data.conversion.length-1; i++) {
		arrayConvers.push([data.conversion[i].goalName, data.conversion[i].conversion]);
	}
	//рисуем диаграмму
	google.load("visualization", "1", {packages:["corechart"]});
	google.setOnLoadCallback(drawChart);
	function drawChart() {
		var data = google.visualization.arrayToDataTable(arrayConvers);
		var options = {
			//title: 'Конверсия',
			//hAxis: {title: 'Дата'},
			//vAxis: {title: 'Число'}
		};
		var chart = new google.visualization.ColumnChart(document.getElementById('conversChart'));
		chart.draw(data, options);
	}
	
	//табличка по ключевым запросам
	var table = "<table>";
	table += "";
	table += "<tr>";
	table += "<td rowspan=2>Запросы</td>";
	table += "<td colspan=2>Текущий месяц ("+ data.comparisonKeywordsTopvisor[0].month +")</td>";
	table += "<td colspan=2>Предыдущий месяц ("+ data.comparisonKeywordsTopvisor[1].month +")</td>";
	table += "</tr>";
	table += "<tr>";
	table += "<td>Яндекс</td>";
	table += "<td>Google</td>";
	table += "<td>Яндекс</td>";
	table += "<td>Google</td>";
	table += "</tr>";
	for (let i = 0; i < data.comparisonKeywordsTopvisor[0].positions.length; i++) {
		table += "<tr>";
		table += "<td>"+ data.comparisonKeywordsTopvisor[0].positions[i].keyword +"</td>";
		table += "<td>"+ data.comparisonKeywordsTopvisor[0].positions[i].position[0].position.position +"</td>";
		table += "<td>"+ data.comparisonKeywordsTopvisor[0].positions[i].position[1].position.position +"</td>";
		table += "<td>"+ data.comparisonKeywordsTopvisor[1].positions[i].position[0].position.position +"</td>";
		table += "<td>"+ data.comparisonKeywordsTopvisor[1].positions[i].position[1].position.position +"</td>";
		table += "<tr>";
	}
	table += "</table>";
	document.getElementById("keyword").innerHTML = table;
}

//выбор дат
function setDate() {
	//console.log('OLD startDate=' + startDate + ' endDate=' + endDate);
	$('input[name="daterange"]').daterangepicker({
		autoApply: true,
		opens: 'left',
		locale: {
			format: "DD/MM/YYYY",
			firstDay: 1,
			daysOfWeek: [
				"Вс","Пн","Вт","Ср","Чт","Пт","Сб"
			],
			monthNames: [
				"Январь","Февраль","Март","Апрель","Май","Июнь",
				"Июль","Август","Сентябрь","Октябр","Ноябрь","Декабрь"
			],
			}
	}, function(start, end, label) {
			//console.log(start.format('DD-MM-YYYY') + ' ' + end.format('DD-MM-YYYY'));
			startDate = start.format('YYYY-MM-DD');
			endDate = end.format('YYYY-MM-DD');
			//console.log('NEW startDate=' + startDate + ' endDate=' + endDate);
			getData();
		});
};

function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yyyy = date.getFullYear();
  if (yyyy < 10) yyyy = '0' + yyyy;

  return yyyy + '-' + mm + '-' + dd;
}

start()
setDate()