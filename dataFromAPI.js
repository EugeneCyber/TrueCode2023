export class Model{
   constructor(tokenYandex,tokenTopVisor){
      this.tokenYandex=tokenYandex;
      this.tokenTopVisor=tokenTopVisor;
   }
   async getIDs(){
      let IDs = new Array();
      let yandexReqData = (await (await fetch("https://api-metrika.yandex.net/management/v1/counters",{ method:'GET',headers:{Authorization:'OAuth '+ this.tokenYandex}})).json()).counters;
      for(let item of yandexReqData){
         IDs.push({idYandex:item.id,name:item.name,site:item.site});
      }

      await fetch("https://api.topvisor.com/v2/json/get/projects_2/projects",{
         method:"POST",
         headers:{
            "Content-Type": "application/json",
            "User-Id":"358921",
            "Authorization": "bearer " + this.tokenTopVisor
         },
         body:JSON.stringify({"fields":["id","name","url"]})
      })
         .then(req=>req.json())
         .then(data=>{
            for(let prodTopVisor of data.result){
               for(let item of IDs){
                  if(prodTopVisor.url === item.site){
                     item.idTopVisor = prodTopVisor.id;
                  }
               }
            }
         });
      return IDs
   }

   async SourcesForPeriod(date1,date2,id){
      let dataSource = new Array();
      await fetch(`https://api-metrika.yandex.net/stat/v1/data?date1=${date1}&date2=${date2}&dimensions=ym:s:<attribution>TrafficSource&attribution=cross_device_last_significant&filters=ym:s:isRobot=='No'&metrics=ym:s:visits,ym:s:users&lang=ru&id=${id}`,{
                                 method:'GET',
                                 headers:{Authorization:'OAuth '+this.tokenYandex}
                              })
         .then(resp=>resp.json())
         .then(data=>{   
                        for(let item of data.data){
                           dataSource.push({
                                             name:item.dimensions[0].name,
                                             visits:item.metrics[0],
                                             users:item.metrics[1]
                                          });
                        }
         });
      return dataSource;
   }

   async DynamicsSiteTrafficForPeriod(date1,date2,id){
      let dataTraffic = new Array();
      await fetch(`https://api-metrika.yandex.net/stat/v1/data/bytime?date1=${date1}&date2=${date2}&group=day&metrics=ym:s:visits,ym:s:users&filters=ym:s:<attribution>TrafficSource=='organic' AND ym:s:isRobot=='No'&attribution=lastsign&lang=ru&id=${id}`,{
                                 method:'GET',
                                 headers:{Authorization:'OAuth '+this.tokenYandex}
                              })
         .then(resp=>resp.json())
         .then(data=>{
                        for(let i = 0; i < data.time_intervals.length; i++){
                           dataTraffic.push({
                                             interval:data.time_intervals[i],
                                             visits:data.totals[0][i],
                                             users:data.totals[1][i]
                                          });
                        }
          });
      return dataTraffic;
   }

   async SearchPhrase(date1,date2,id,minUserOrVisit){
      let dataPhrase = new Array();
      await fetch(`https://api-metrika.yandex.net/stat/v1/data?date1=${date1}&date2=${date2}&filters=(ym:s:visits>${minUserOrVisit} OR ym:s:users>${minUserOrVisit}) AND ym:s:isRobot=='No'&dimensions=ym:s:SearchPhrase&metrics=ym:s:visits,ym:s:users&lang=ru&id=${id}`,{
                                 method:'GET',
                                 headers:{Authorization:'OAuth '+this.tokenYandex}
                              })
         .then(resp=>resp.json())
         .then(data=>{
                     for(let item of data.data){
                        dataPhrase.push({
                              name:item.dimensions[0].name,
                              visits:item.metrics[0],
                              users:item.metrics[1]
                           });
                     }
         });
      return dataPhrase;
   }

   async DeviceCategory(date1,date2,id,){
      let dataDevice = new Array();
      await fetch(`https://api-metrika.yandex.net/stat/v1/data?date1=${date1}&date2=${date2}&filters=ym:s:isRobot=='No'&dimensions=ym:s:deviceCategory&metrics=ym:s:visits,ym:s:users&lang=ru&id=${id}`,{
                                 method:'GET',
                                 headers:{Authorization:'OAuth '+this.tokenYandex}
                              })
         .then(resp=>resp.json())
         .then(data=>{
                     for(let item of data.data){
                        dataDevice.push({
                              name:item.dimensions[0].name,
                              visits:item.metrics[0],
                              users:item.metrics[1]
                           });
                     }
         });
      return dataDevice;
   }

   async SearchEngine(date1,date2,id,){
      let dataSearchEngine = new Array();
      await fetch(`https://api-metrika.yandex.net/stat/v1/data?date1=${date1}&date2=${date2}&dimensions=ym:s:<attribution>SearchEngineRoot&attribution=cross_device_last_significant&filters=ym:s:isRobot=='NO'&metrics=ym:s:visits,ym:s:users&lang=ru&id=${id}`,{
                                 method:'GET',
                                 headers:{Authorization:'OAuth '+this.tokenYandex}
                              })
         .then(resp=>resp.json())
         .then(data=>{
                     for(let item of data.data){
                        dataSearchEngine.push({
                              name:item.dimensions[0].name,
                              visits:item.metrics[0],
                              users:item.metrics[1]
                           });
                     }
         });
      return dataSearchEngine;
   }

   async Conversion(date1,date2,id,){
      let dataGoalIDs = new Array();
      let dataConversion = new Array();
      await fetch(`https://api-metrika.yandex.net/stat/v1/data?date1=${date1}&date2=${date2}&filteres=ym:s:isRobot=='NO'&dimensions=ym:s:goal&metrics=ym:s:anyGoalConversionRate&lang=ru&id=${id}`,{
                                 method:'GET',
                                 headers:{Authorization:'OAuth '+this.tokenYandex}
                              })
         .then(resp=>resp.json())
         .then(data=>{
                     for(let item of data.data){
                        dataGoalIDs.push({
                              id:item.dimensions[0].id,
                              name:item.dimensions[0].name
                           });
                     }
         });
         for(let i = 0;i<dataGoalIDs.length;i++){
            await fetch(`https://api-metrika.yandex.net/stat/v1/data?date1=${date1}&date2=${date2}&metrics=ym:s:goal<goal_id>conversionRate&goal_id=${dataGoalIDs[i].id}&lang=ru&id=${id}`,{method:"GET",headers:{Authorization:'OAuth '+this.tokenYandex}})
               .then(resp=>resp.json())
               .then(data=>dataConversion.push({goalName:dataGoalIDs[i].name, conversion:data.data[0].metrics[0]}))
         }
      return dataConversion;
   }

   async persentOutTop10(id){
      let date = new Date();
      let date2 = date.toISOString().split("T")[0];
      date.setMonth(date.getMonth()-1);
      let date1 = date.toISOString().split("T")[0];
      let searchAndRegion;
      let requestDataTopVisor = {
         filters:[{
            name :"id",
            operator:"EQUALS",
            values:[id]
            }],
         show_searchers_and_regions:true,
      }
      await fetch('https://api.topvisor.com/v2/json/get/projects_2/projects',
         {
            method:"POST",
            headers:{
               "Content-Type": "application/json",
               "User-Id":"358921",
               "Authorization": "bearer " + this.tokenTopVisor
            },
            body:JSON.stringify(requestDataTopVisor)
         })
         .then(req=>req.json())
         .then(data=>{
            let a = 0;
            searchAndRegion = data.result[0].searchers.map((item)=>[item.regions.reduce((acc, item)=>{return item.index},a),item.name]);
            
         });
      let result = new Array();
      for(let search of searchAndRegion){
         await fetch("https://api.topvisor.com/v2/json/get/positions_2/summary",
         {
            method:"POST",
            headers:{
               "Content-Type": "application/json",
               "User-Id":"358921",
               "Authorization": "bearer " + this.tokenTopVisor
            },
            body:JSON.stringify({project_id:id, region_index:search[0], dates:[date1,date2],  show_tops:1,show_dynamics: 1})
         })
            .then(req=>req.json())
            .then(data=>{
               result.push({name:search[1], numberOfSearchresultTop:data.result.tops[1]['1_10'], all:data.result.dynamics.all});
            });
      }
     return result;
   }

   async comparisonKeywords(id){
      let requestDataTopVisor1 = {
         filters:[{
            name :"id",
            operator:"EQUALS",
            values:[id]
            }],
         show_searchers_and_regions:true,
      }
      let searchers = new Array();
      await fetch('https://api.topvisor.com/v2/json/get/projects_2/projects',
         {
            method:"POST",
            headers:{
               "Content-Type": "application/json",
               "User-Id":"358921",
               "Authorization": "bearer " + this.tokenTopVisor
            },
            body:JSON.stringify(requestDataTopVisor1)
         })
         .then(req=>req.json())
         .then(data=>{
            let tempArrayRegions = new Array();
            let count;
            for(let search of data.result[0].searchers){
               count=0;
               for(let region of search.regions){
                  tempArrayRegions[count]={name:region.name, index:String(region.index)};
                  count+=1;
               }
               searchers.push({name:search.name, regions:tempArrayRegions});
               tempArrayRegions = tempArrayRegions.splice(1,tempArrayRegions.length);
            }
         });
      
      let date = new Date();
      let date2 = date.toISOString().split("T")[0];
      date.setMonth(date.getMonth()-1);
      let date1 = date.toISOString().split("T")[0];
      let indexes = new Array();
      for(let search of searchers){
         for(let region of search.regions){
            indexes.push(region.index);
         }
      }
      let requestDataTopVisor;
      let result = new Array();
      for(let i=0;i<2;i++){
         requestDataTopVisor = {
            project_id:id,
            regions_indexes:indexes,
            date1:date1,
            date2:date2,
            count_dates:1
         }
         await fetch('https://api.topvisor.com/v2/json/get/positions_2/history',
            {
               method:"POST",
               headers:{
                  "Content-Type": "application/json",
                  "User-Id":"358921",
                  "Authorization": "bearer " + this.tokenTopVisor
               },
               body:JSON.stringify(requestDataTopVisor)
            })
            .then(req=>req.json())
            .then(data=>{
               let dataPosition = new Array();
               let nameSearch, tempIndex;
               for(let keyword of data.result.keywords){
                  let position=new Array();
                  for(let key in keyword.positionsData){
                     tempIndex = key.split(':')[2]

                     for(let search of searchers){
                        for(let region of search.regions){
                           if(region.index===tempIndex){
                              nameSearch = search.name;
                           }
                        }
                     }

                     position.push({searchName:nameSearch, position:keyword.positionsData[key]});
                  }
                  dataPosition.push({keyword:keyword.name, position:position})
               }
               result.push({month:date.getMonth()+2, positions: dataPosition});
            });
            date2 = date.toISOString().split("T")[0];
            date.setMonth(date.getMonth()-1);
            date1 = date.toISOString().split("T")[0];
      }
      return result;
   }
}



