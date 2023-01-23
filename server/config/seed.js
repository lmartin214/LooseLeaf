//Seeded Data using models from schema
const db = require('./connection');
const { User, Product, Category } = require('../models');

db.once('open', async () => {
  await Category.deleteMany();

  const categories = await Category.insertMany([
    { name: 'Edible' },
    { name: 'Extract' },
    { name: 'Flower' },
    { name: 'Pre-Roll' },
    { name: 'Vape' }
  ]);

  console.log('categories seeded');

  await Product.deleteMany();

  const products = await Product.insertMany([
    {
      name: 'Girl Scout Cookies',
      description:
        '3.5G Hybird 24.4% THC MERCYENE',
      image: 'GSC.jpg',
      category: categories[2]._id,
      price: 34.99,
      quantity: 128
    },
    {
      name: 'Mendo Breathe Shatter',
      description:
        'Hybird 1G 89.4% THC Caryophyllene',
      image: 'shatter.jpg',
      category: categories[1]._id,
      price: 24.99,
      quantity: 448
    },
    {
      name: 'Cherry Pie Heavy Hitters Cartridge',
      category: categories[4]._id,
      description:
       'Indica 1G 100% live resin vape cartridges 81.9% THC Myrcene',
      image: 'HHcart.jpg',
      price: 37.99,
      quantity: 448
    },
    {
      name: 'Zoap Crumble',
      category: categories[1]._id,
      description:
        'Rainbow Sherbet X Pink Guava Hybrid 1G strain cookie crumble textured extract 88.2%THC Caryophyllene',
      image: 'crumble.jpg',
      price: 59.99,
      quantity: 448
    },
    {
      name: 'CANN Lemon Lavender Tonic',
      category: categories[0]._id,
      description:
        '6PK 2mg THC, 4mg CDB per can Social Tonic',
      image: 'cann.jpg',
      price: 14.99,
      quantity: 100
    },
    {
      name: 'Tarantula Pre-Roll',
      category: categories[3]._id,
      description:
        '2PK Hemp paper pre rolls dipped in THC clear distillate and coated to keef 34.1% THC Myrcene',
      image: 'preRoll.jpg',
      price: 9.99,
      quantity: 224
    },
    {
      name: 'Pro Tab from LEVEL',
      category: categories[0]._id,
      description:
      '10 Hybrid tab each swallowable tablet contains 25 mg of THC ',
      image: 'level1.jpg',
      price: 19.99,
      quantity: 100
    },
    {
      name: 'Jack Herer Jetty Cartridge',
      category: categories[4]._id,
      description: 'Sativa 1G 100% live resin vape cartridges 84.9% THC Terpinolene',
      image: 'jetty.jpg',
      price: 37.99,
      quantity: 448
    },
    {
      name: 'Canndescent Pre-Roll 5PK',
      category: categories[3]._id,
      description: 'With five .5g pre-rolls, Canndescent is has conveniently packaged together an experience each of their signature effects.',
      image: 'canndescent.jpg',
      price: 21.99,
      quantity: 1000
    },
    {
      name: 'Kiva Terra Blueberries',
      category: categories[0]._id,
      description: 
      '5mg bite 100mg pack these Delicious dried blueberries are dusted with cocoa powder then finished with a generous coating of creamy milk chocolate infused with cold water hash',
      image: 'Terra_BL.jpg',
      price: 19.99,
      quantity: 1000
    },
    {
      name: 'Red Congolese',
      category: categories[3]._id,
      description:
        '3.5G Red Congolese is an African Sativa Landrace strain 23.4% THC Mrycene',
      image: 'redC.jpg',
      price: 34.99,
      quantity: 100
    },
    {
       name: 'Biscotti',
        description:
          '3.5G Hybird Gelato 25 X Sour Florida OG 21.4% THC Caryophyllene',
        image: 'GSC.jpg',
        category: categories[2]._id,
        price: 34.99,
        quantity: 128 
    }
  ]);

  console.log('products seeded');

  await User.deleteMany();

  await User.create({
    firstName: 'Damien',
    lastName: 'Pelasaini',
    email: 'damienP@testemail.com',
    password: 'password12345',
    orders: [
      {
        products: [products[0]._id, products[0]._id, products[1]._id]
      }
    ]
  });

  await User.create({
    firstName: 'Davon',
    lastName: 'Martin',
    email: 'davonM@testemail.com',
    password: 'password12345'
  });

  console.log('users seeded');

  process.exit();
});
