const KoaRouter = require('koa-router');

const router = new KoaRouter();

const Sequelize = require('sequelize');

const op = Sequelize.Op;

const fetch = require("node-fetch");

const unirest = require("unirest")

async function loadDestination(ctx, next) {
  ctx.state.destination = await ctx.orm.destination.findById(ctx.params.id);
  return next();
}

router.get('destinations.list', '/', async (ctx) => {
  const destinationsList = await ctx.orm.destination.findAll();
  const itinerary = null;
  await ctx.render('destinations/index', {
    itinerary,
    addDestinationToItinerary: d => d,
    destinationsList,
    newDestinationPath: ctx.router.url('destinations.new'),
    showDestinationPath: destination => ctx.router.url('destinations.show', { id: destination.id }),
    editDestinationPath: destination => ctx.router.url('destinations.edit', { id: destination.id }),
    deleteDestinationPath: destination => ctx.router.url('destinations.delete', { id: destination.id }),
  });
});
// no funca yet
router.get('destinations.assign', '/itineraries/:id/add_destination', async (ctx) => {
  const itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  const destinationsListId = await ctx.orm.itineraryDestination.findAll(
    { where: { itineraryId: { $not: itinerary.id } } },
  );
  const destinationsList = [];
  // esto podria hacer que si un dest está con dos itin que no queremos, aparezca 2 veces
  // esta parte está complicada, hacer push de todos lo destinos a destinationList sin await en for
  await Promise.all(destinationsListId.map(async (destItin) => {
    const destination = await ctx.orm.destination.findById(
      { where: { id: destItin.destination_id } },
    );
    destinationsList.push(destination);
  }));
  await ctx.render('destinations/index', {
    itinerary,
    destinationsList,
    addDestinationToItinerary: destination => ctx.router.url('destinations.add', { id: itinerary.id, destid: destination.id }),
    newDestinationPath: ctx.router.url('destinations.new'),
    showDestinationPath: destination => ctx.router.url('destinations.show', { id: destination.id }),
    editDestinationPath: destination => ctx.router.url('destinations.edit', { id: destination.id }),
    deleteDestinationPath: destination => ctx.router.url('destinations.delete', { id: destination.id }),
  });
});

router.get('destinations.find', '/search', async (ctx) => {
  console.log(ctx.state)
  let name = ctx.request.query.search.toLowerCase();
  if (name == ""){
    name = "asaadadefewfrgvdsafe"
  }
  const simple = true;
  const destinationSearch = await ctx.orm.destination.findAll({
    where: {
      destinationName: {
        [op.like]: `%${name}%`
      },
    },
  });
  if (name == "asaadadefewfrgvdsafe"){
    name = ""
  }
  // eslint-disable-next-line max-len
  const itineraries = await Promise.all(destinationSearch.map(destination => destination.getItineraries()));
  await ctx.render('/search', {
    min_b: 0,
    max_b: 4050,
    destination1: name,
    destination2: "",
    destination3: "",
    min_b: 0,
    max_b: 4050,
    min_d: 0,
    max_d: 30,
    rating: 0,
    simple,
    destinationSearch,
    itineraries,
    showItineraryPath: itinerary => ctx.router.url('itineraries.show', { id: itinerary.id }),
    editItineraryPath: itinerary => ctx.router.url('itineraries.edit', { id: itinerary.id }),
    deleteItineraryPath: itinerary => ctx.router.url('itineraries.delete', { id: itinerary.id }),
    showDestinationPath: destination => ctx.router.url('destinations.show', { id: destination.id }),
    superSearchPath: ctx.router.url('destinations.supersearch'),
  });
});
router.get('destinations.search', '/search/:id', async (ctx) => {
  const dest = await ctx.orm.destination.findById(ctx.params.id)
  const name = dest.destinationName.toLowerCase();
  const simple = true;
  const destinationSearch = await ctx.orm.destination.findAll({
    where: {
      destinationName: {
        [op.like]: `%${name}%`
      },
    },
  });

  // eslint-disable-next-line max-len
  const itineraries = await Promise.all(destinationSearch.map(destination => destination.getItineraries()));
  await ctx.render('/search', {
    min_b: 0,
    max_b: 4050,
    destination1: name,
    destination2: "",
    destination3: "",
    min_b: 0,
    max_b: 4050,
    min_d: 0,
    max_d: 30,
    rating: 0,
    simple,
    destinationSearch,
    itineraries,
    showItineraryPath: itinerary => ctx.router.url('itineraries.show', { id: itinerary.id }),
    editItineraryPath: itinerary => ctx.router.url('itineraries.edit', { id: itinerary.id }),
    deleteItineraryPath: itinerary => ctx.router.url('itineraries.delete', { id: itinerary.id }),
    showDestinationPath: destination => ctx.router.url('destinations.show', { id: destination.id }),
    superSearchPath: ctx.router.url('destinations.supersearch'),
  });
});

router.get('destinations.supersearch', '/ssearch', async (ctx) => {
  const simple = false;
  let destination1 = ctx.request.query.destination1.toLowerCase();
  let destination2 = ctx.request.query.destination2.toLowerCase();
  let destination3 = ctx.request.query.destination3.toLowerCase();
  if (destination1 != "" || destination2 != "" || destination3 != ""){
    if (destination1 == ""){
      destination1 = "aabbccdddeeffghhiijjka"
    }
    if (destination2 == ""){
      destination2 = "aabbccdddeeffghhiijjka"
    }
    if (destination3 == ""){
      destination3 = "aabbccdddeeffghhiijjka"
    }
  }
  const rating = ctx.query.rating;
  const min_b = ctx.query.minrangeb;
  const max_b = ctx.query.maxrangeb;
  const min_d = ctx.query.minranged;
  const max_d = ctx.query.maxranged;
  const destinationSearch = await ctx.orm.destination.findAll({
      where: {
        destinationName: {
          [op.like]: {
            [op.any]: [`%${destination1}%`, `%${destination2}%`, `%${destination3}%`]
          }
        },
      },
    });
  if (destination1 == "aabbccdddeeffghhiijjka"){
    destination1 = ""
  }
  if (destination2 == "aabbccdddeeffghhiijjka"){
    destination2 = ""
  }
  if (destination3 == "aabbccdddeeffghhiijjka"){
    destination3 = ""
  }
  let itinerary_fin = [];
  let itinerary_dest;
  const itineraries = await Promise.all(destinationSearch.map(destination => destination.getItineraries()));
  itineraries.forEach((destination) => {
    itinerary_dest = [];
    destination.forEach((itinerary) => {
      if (itinerary.avgScore >= rating || !itinerary.avgScore){
        if (itinerary.budget <= max_b && itinerary.budget >= min_b){
          let days = (Date.parse(itinerary.endDate) - Date.parse(itinerary.startDate))/86400000;
          if (days <= max_d && days >= min_d){
              itinerary_dest.push(itinerary);
          }
        }
      }
    })
    itinerary_fin.push(itinerary_dest);
  })
  await ctx.render('/search', {
    simple,
    destinationSearch,
    itinerary_fin,
    rating,
    min_b,
    max_b,
    min_d,
    max_d,
    destination1,
    destination2,
    destination3,
    showItineraryPath: itinerary => ctx.router.url('itineraries.show', { id: itinerary.id }),
    editItineraryPath: itinerary => ctx.router.url('itineraries.edit', { id: itinerary.id }),
    deleteItineraryPath: itinerary => ctx.router.url('itineraries.delete', { id: itinerary.id }),
    showDestinationPath: destination => ctx.router.url('destinations.show', { id: destination.id }),
    superSearchPath: ctx.router.url('destinations.supersearch'),

  })
  // const rating = ctx.request.query.value;
  // const destinationSearch = await ctx.orm.destination.findAll({
  //   where: {
  //     destinationName: {
  //       [op.like]: `%${name}%`
  //     },
  //   },
  // });
  //
  // // eslint-disable-next-line max-len
  // const itineraries = await Promise.all(destinationSearch.map(destination => destination.getItineraries()));
  // await ctx.render('/search', {
  //   destinationSearch,
  //   itineraries,
  //   showItineraryPath: itinerary => ctx.router.url('itineraries.show', { id: itinerary.id }),
  //   showDestinationPath: destination => ctx.router.url('destinations.show', { id: destination.id }),
  // });
});

router.get('destinations.book','/book', async (ctx) =>{
  await ctx.render('/booking',{
    allflights: False,
    flightsPath: ctx.router.url('destinations.flights')
  })
});

router.get('destinations.flights','/booking/flights', async(ctx) => {
  console.log(ctx.query)
  let origen = ctx.query.origen;
  let destino = ctx.query.destino;
  const vuelta = ctx.query.vuelta;
  const ida = ctx.query.ida;
  const adultos = ctx.query.adults;
  let ciudadesori = await fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" + origen,
      {headers:{
        "X-RapidAPI-Key":"99e67c76famsh6f0e0b458c67747p12ae57jsnca0007c820a8",
        "X-RapidAPI-Host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
      }}).then(response => response.json());
      console.log(ciudadesori)
      // .header("X-RapidAPI-Key", "99e67c76famsh6f0e0b458c67747p12ae57jsnca0007c820a8")
      // .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
      // .end(function (result) {
      //     origen = result.body.Places[0].PlaceId;});
  let ciudadesdest = await fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" + destino,
      {headers:{
        "X-RapidAPI-Key":"99e67c76famsh6f0e0b458c67747p12ae57jsnca0007c820a8",
        "X-RapidAPI-Host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
      }}).then(response => response.json());
    console.log(ciudadesdest);
  const queryString = ciudadesori.Places[0].PlaceId + '/' + ciudadesdest.Places[0].PlaceId + '/' + ida + '/' + vuelta;
  let vuelos = await fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/CL/USD/en-US/" + queryString,
  {headers:{
    "X-RapidAPI-Key":"99e67c76famsh6f0e0b458c67747p12ae57jsnca0007c820a8",
    "X-RapidAPI-Host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
  }}).then(response => response.json());
  console.log(vuelos);
  const quotes = vuelos.Quotes;
  const places = vuelos.Places;
  const carriers = vuelos.Carriers;
  const Currencies = vuelos.Currencies;
  const allflights = []
  quotes.forEach((quote) => {
  dic = {
  quote: quote,
  origout: places.find(p => p.PlaceId == quote.OutboundLeg.OriginId),
  destout: places.find(p => p.PlaceId == quote.OutboundLeg.DestinationId),
  retOrig: places.find(p => p.PlaceId == quote.InboundLeg.OriginId),
  retDest: places.find(p => p.PlaceId == quote.InboundLeg.DestinationId),
  oneWayCarrier: carriers.find(c => c.CarrierId == quote.OutboundLeg.CarrierIds[0]),
  returnCarrier: carriers.find(c => c.CarrierId == quote.InboundLeg.CarrierIds[0]),
  }
  allflights.push(dic);
});
  console.log(allflights);
  await ctx.render('/booking',{
    places,
    carriers,
    allflights,
    Currencies,
    flightsPath: ctx.router.url('destinations.flights')

  })
  // var userMarket = "US";
  // var currency = "USD";
  // var locale = "en-US";
  // var origin = "NYCA-sky"; // New york (any airport)
  // var destiration = "PARI-sky"; // Paris (any airport)
  // var tomorrow = new Date(new Date().getTime()+2*86400000).toISOString().slice(0, 10);
  // var afterTomorrow = new Date(new Date().getTime()+(3*86400000)).toISOString().slice(0, 10);
  // var departureDate = tomorrow; // format yyyy-mm-dd , ie: 2020-01-30
  // var returnDate = afterTomorrow; // format yyyy-mm-dd , ie: 2020-02-28
  //
  // var queryString = userMarket + '/' + currency + '/' + locale + '/' + origin + '/' + destiration + '/' + departureDate + '/' + returnDate;
  // unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/" + queryString)
  // .header("X-RapidAPI-Key", "99e67c76famsh6f0e0b458c67747p12ae57jsnca0007c820a8")
  // .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
  // .end(function (result) {
  //    result.body.Quotes.forEach(q => printFlightSearchResult(q, result.body))
  // });
  // function printFlightSearchResult( quote, apiResponse){
  //    var places = apiResponse.Places;
  //    var carriers = apiResponse.Carriers;
  //    var origOut = places.find(p => p.PlaceId == quote.OutboundLeg.OriginId);
  //    var destOut = places.find(p => p.PlaceId == quote.OutboundLeg.DestinationId);
  //
  //    var retOrig = places.find(p => p.PlaceId == quote.InboundLeg.OriginId);
  //    var retDest = places.find(p => p.PlaceId == quote.InboundLeg.DestinationId);
  //    var oneWayCarrier = carriers.find(c => c.CarrierId == quote.OutboundLeg.CarrierIds[0]);
  //    var returnCarrier = carriers.find(c => c.CarrierId == quote.InboundLeg.CarrierIds[0]);
  //
  //    console.log(`The cheapest ${quote.Direct ? "" : "in"}direct flight is
  //    on ${quote.OutboundLeg.DepartureDate}
  //    from ${origOut.CityName} (${origOut.IataCode} - ${origOut.Name}) ` +
  //    `to ${destOut.CityName} (${destOut.IataCode} - ${destOut.Name})
  //    operated by ${oneWayCarrier.Name}
  //    and returning
  //
  //    on ${quote.InboundLeg.DepartureDate}
  //    from ${retOrig.CityName} (${retOrig.IataCode} - ${retOrig.Name}) `+
  //    `to ${retDest.CityName} (${retDest.IataCode} - ${retDest.Name})
  //    operated by ${returnCarrier.Name}
  //    will cost you ${quote.MinPrice} ${apiResponse.Currencies[0].Code}
  //    `);
  // }
});

router.get('destinations.new', '/new', async (ctx) => {
  const destination = ctx.orm.destination.build();
  await ctx.render('destinations/new', {
    destination,
    submitDestinationPath: ctx.router.url('destinations.create'),
  });
});
router.get('destinations.itinerary.new', '/itineraries/:id/destinations/new', async (ctx) => {
  const destination = ctx.orm.destination.build();
  const itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  await ctx.render('destinations/new', {
    destination,
    itinerary,
    submitDestinationPath: ctx.router.url('destinations.itinerary.create', { id: itinerary.id }),
  });
});

router.get('destinations.edit', '/:id/edit', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  await ctx.render('destinations/edit', {
    destination,
    submitDestinationPath: ctx.router.url('destinations.update', { id: destination.id }),
  });
});

router.get('destinations.show', '/:id', loadDestination, async (ctx) => {
  await ctx.render('destinations/show', {
    editDestinationPath: destination => ctx.router.url('destinations.edit', { id: destination.id }),
    deleteDestinationPath: destination => ctx.router.url('destinations.delete', { id: destination.id }),
  });
});

router.post('destinations.create', '/', async (ctx) => {
  const destination = ctx.orm.destination.build(ctx.request.body);
  try {
    await destination.save({ fields: ['destinationName', 'destinationPicture'] });
    ctx.redirect(ctx.router.url('destinations.list'));
  } catch (validationError) {
    await ctx.render('destinations/new', {
      destination,
      errors: validationError.errors,
      submitDestinationPath: ctx.router.url('destinations.create'),
    });
  }
});
router.post('destinations.itinerary.create', '/:id', async (ctx) => {
  const destination = ctx.orm.destination.build(ctx.request.body);
  const itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  const itineraryDestination = ctx.orm.itineraryDestination.build();
  try {
    destination.destinationName = destination.destinationName.toLowerCase();
    await destination.save({ fields: ['destinationName', 'destinationPicture'] });
    const itineraryId = itinerary.id;
    // eslint-disable-next-line camelcase
    const destination_id = destination.id;
    await itineraryDestination.update({ itineraryId, destination_id });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    const d_name = ctx.request.body.destinationName.toLowerCase()
    const destination_e = await ctx.orm.destination.findAll({
      where: {
        destinationName: d_name
      },
    });
    const itineraryId = itinerary.id;
    const destination_id = destination_e[0].id;
    const exist = await ctx.orm.itineraryDestination.findAll({
      where: {
        itineraryId: itineraryId,
        destination_id: destination_id,
      }
    })
    if (!exist.length){
      await itineraryDestination.update({ itineraryId, destination_id });
    }
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
    // await ctx.render('destinations/new', {
    //   destination,
    //   errors: validationError.errors,
    //   submitDestinationPath: ctx.router.url('destinations.create'),
    // });
  }
});

router.patch('destinations.update', '/:id', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  try {
    const {
      destinationName,
    } = ctx.request.body;
    await destination.update({
      destinationName,
    });
    ctx.redirect(ctx.router.url('destinations.list'));
  } catch (validationError) {
    await ctx.render('destinations/edit', {
      destination,
      errors: validationError.errors,
      submitDestinationPath: ctx.router.url('destinations.update'),
    });
  }
});
// no funca yet
router.patch('destinations.add', '/:id', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  const { itinerary } = await ctx.orm.itinerary.findById(ctx.params.id);
  const itineraryId = itinerary.id;
  await destination.update({ itineraryId });
  ctx.redirect(ctx.router.url('itinerary.show', { id: itinerary.id }));
});

router.del('destinations.delete', '/:id', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  await destination.destroy();
  ctx.redirect(ctx.router.url('destinations.list'));
});
// no funca
router.del('destinations.itineraries.delete', '/:dest_id/:id', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  const itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  await destination.destroy();
  ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
});

module.exports = router;
