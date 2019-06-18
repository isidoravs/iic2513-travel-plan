// $(function(){
//   let origentags = [];
//   $('#origen').keyup(function(){
//     let oinput = this.value;
//     console.log(oinput);
//     unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" + origen)
//     .header("X-RapidAPI-Key", "99e67c76famsh6f0e0b458c67747p12ae57jsnca0007c820a8")
//     .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
//     .end(function (result) {
//         result.body.Places.forEach(q => {
//           origentags.push(q.PlaceName)
//         })
//      });
//   })
//
// });
