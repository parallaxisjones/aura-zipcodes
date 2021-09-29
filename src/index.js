const search = require("./search");
// lambda-like handler function
module.exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    const { httpMethod, queryStringParameters } = event;

    if (!httpMethod === "GET" || queryStringParameters.type) {
      throw new Error("Not Allowed");
    }

    switch (queryStringParameters.type) {
      case "latlong": {
        const { lat, long, distance, unit } = queryStringParameters.params;
        if (!lat || !long || !distance) {
          throw new Error("Missing Parameter");
        }
        return search
          .searchLatLong({
            lat,
            long,
            distance,
            unit,
          })
          .then(resolve)
          .catch(reject);
      }
      case "zip": {
        const { zipcode } = queryStringParameters.params;
        if (!zipcode) {
          throw new Error("Missing zipcode parameter");
        }
        return search
          .searchZip(zipcode)
          .then(resolve)
          .catch(reject);
      }
      case "city": {
        const { city } = queryStringParameters.params;
        if (!city) {
          throw new Error("Missing City Parameter");
        }
        return search
          .searchCity(city)
          .then(resolve)
          .catch(reject);
      }
      default:
        throw new Error("search type not implemented");
    }
  });
};
