# CompanyA test

## Task (Pricing a basket)

Write a client side web application in JavaScript, with associated unit tests, that can price a Basket of goods in a number of different currencies. The goods that can be purchased, which are all priced in GBP, are:

* Peas – 95p per bag
* Eggs – £2.10 per dozen
* Milk – £1.30 per bottle
* Beans – 73p per can

The program should allow the user to add or remove items in a basket. The user can click on a checkout button which will then display the total price for the basket with the option to display the amount in different currencies. For example, if the basket contained Milk and the currency selected was USD with an exchange rate of 1.5, the total would be $1.95 USD.

No UI design constraints are enforced so feel free to design the UI in the way you see as most appropriate for the solution.

The list of currencies should be consumed from http://jsonrates.com/currencies.json. To convert to other currencies, you will need to create an account on http://jsonrates.com/. This will then issue you with an API-Key that permits reading from the various public APIs listed on their site. The exchange rates may change at any time.

The code and design should meet these requirements but be sufficiently flexible to allow for future extensibility. The code should be well structured, suitably commented, have error handling and be tested.

## Notes

[Create React App](https://github.com/facebookincubator/create-react-app) was used to bootstrap this application

`npm start` - runs the app in development mode.

`npm test` - runs the test watcher in an interactive mode.

`npm run build` - builds the app for production to the build folder.

jsonrates.com has deprecated their API (http://jsonrates.com/about/), so I had to use https://currencylayer.com/ instead. The only issue with that was that I couldn't use GBP as default currency with free account, so I've used USD.

## Libraries used

* [React](https://facebook.github.io/react/)
* [React Router](https://reacttraining.com/react-router/web)
* [Redux](http://redux.js.org/)
* [React Redux](https://github.com/reactjs/react-redux)
* [Lodash](https://lodash.com/)
* [Currency Formatter](https://github.com/smirzaei/currency-formatter)
* [Enzyme](https://github.com/airbnb/enzyme) (for testing)
* [deep-freeze](https://github.com/substack/deep-freeze) (for testing)
* [Jest Fetch Mock](https://github.com/jefflau/jest-fetch-mock) (for testing)