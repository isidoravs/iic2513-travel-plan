const KoaRouter = require('koa-router');

const router = new KoaRouter();

const Sequelize = require('sequelize');

const op = Sequelize.Op;

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
  const name = ctx.request.query.search.toLowerCase();
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
    if (!exist){
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
