//------------------------------
console.clear();
//------------------------------
import express from "express";
import bodyParser from "body-parser";
import {Model} from "./dataFromAPI.js";

const __dirname = new URL("./",import.meta.url).href.slice(8);
const tokenYandex = 'y0_AgAAAABu9NRrAAolqgAAAADnKTk34NU7eXSCTiG-M1YC6p-zwSwK9bc';
const tokenTopVisor = '46d84eaa08c50379ce6b59607e0d5b79';
const model = new Model(tokenYandex,tokenTopVisor);


const app = express();
const hostname="0.0.0.0";
const port = 3000;

app.use(express.static('view'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res)=>{
   res.sendFile(__dirname + "./view/index.html");
});

app.get('/getIds',async (req,res)=>{
   let response = await model.getIDs();
   res.send(response);
});

app.post('/getData',async (req,res)=>{
   console.log(req.body);

   let dataSource = await model.SourcesForPeriod(req.body.dateForSource.start, req.body.dateForSource.end, req.body.idYandex);
   //console.log(dataSource);

   let dataTraffic = await model.DynamicsSiteTrafficForPeriod(req.body.dateForTraffic.start, req.body.dateForTraffic.end, req.body.idYandex);
   //console.log(dataTraffic);

   let dataPhrase = await model.SearchPhrase(req.body.dateForPhrase.start, req.body.dateForPhrase.end, req.body.idYandex, req.body.dateForPhrase.minValue);
   //console.log(dataPhrase);

   let dataDevice = await model.DeviceCategory(req.body.dateForDevice.start, req.body.dateForDevice.end, req.body.idYandex);
   // console.log(dataDevice);

   let dataSearchEngine = await model.SearchEngine(req.body.dateForSearchEngine.start, req.body.dateForSearchEngine.end, req.body.idYandex);
   // console.log(dataSearchEngine);

   let dataConversion = await model.Conversion(req.body.dateForConversion.start, req.body.dateForConversion.end, req.body.idYandex);
   // console.log(dataConversion);

   let dataTopsTopvisor = await model.persentOutTop10(req.body.idTopVisor);
   //console.log(dataTopsTopvisor);

   let dataComparisonKeywordsTopvisor = await model.comparisonKeywords(req.body.idTopVisor);

   res.send({
      source:dataSource,
      traffic:dataTraffic,
      phrase:dataPhrase,
      device:dataDevice,
      searchEngine:dataSearchEngine,
      conversion:dataConversion,
      topsTopvisor:dataTopsTopvisor,
      comparisonKeywordsTopvisor:dataComparisonKeywordsTopvisor
   });
});

app.listen(port,hostname,()=>{console.log('\x1b[32m%s\x1b[0m',"------------STARTED------------");});

