let SERVER_NAME = 'product-api'
let PORT =5000;
let HOST = '127.0.0.1';

let errors = require('restify-errors');
let restify = require('restify')
let totalCount = 0

  // Get a persistence engine for the products

  , productSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /products')
  console.log(' /products/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());



// Get a single product by their user id
server.get('/products/:id', function (req, res, next) {
  console.log('GET /products/:id params=>' + JSON.stringify(req.params));

  // Find a single user by their id within save
  productSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    if (product) {
      // Send the user if no issues
      res.send(product)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})



// Update a product by their id
server.put('/products/:id', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));
  // validation of manadatory fields
  if (req.body.productId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('product Id must be supplied'))
  }
  if (req.body.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('name must be supplied'))
  }
  if (req.body.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('price must be supplied'))
  }
  if (req.body.quantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('quantity must be supplied'))
  }
  
  let newProducts = {
    productId: req.body.productId, 
		name: req.body.name, 
    price: req.body.price, 
		quantity: req.body.quantity
	}
  
  // Update the product with the persistence engine
  productSave.update(newProducts, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})


// Get all products from the system
server.get('/products', function (req, res, next) {
  console.log('GET /products');
  totalCount++;
  console.log('totalCount:'+totalCount)
  // Find every entity within the given collection
  productSave.find({}, function (error, products) {

    // Return all of the users in the system
    res.send(products)
  })
})

// Create a new product
server.post('/products', function (req, res, next) {
  console.log('POST /users params=>' + JSON.stringify(req.params));
  console.log('POST /users body=>' + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.productId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('product Id must be supplied'))
  }
  if (req.body.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('name must be supplied'))
  }
  if (req.body.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('price must be supplied'))
  }
  if (req.body.quantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('quantity must be supplied'))
  }

  let newProducts = {
    productId: req.body.productId, 
		name: req.body.name, 
    price: req.body.price, 
		quantity: req.body.quantity
	}

  // Create the product using the persistence engine
  productSave.create( newProducts, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, product)
  })
})


//Delete a single product using the persistence engine
server.del('/products/:id', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  // Delete the user with the persistence engine
  
  productSave.delete(req.params.id, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 204 response
    res.send(204)
  })
})



// Delete all products in the persistence engine
server.del('/products', function (req, res, next) {
  console.log('POST /users params=>' + JSON.stringify(req.params));
  // Delete the all products with the persistence engine

  productSave.deleteMany({});
  //const result = productSave.deleteMany({name:"Candle"});
  res.send(201, "All records deleted") 

})

/*server.del('/products/:name', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  // Delete the user with the persistence engine
  productSave.deleteMany({name:req.params.name});
  res.send(204)

})*/

