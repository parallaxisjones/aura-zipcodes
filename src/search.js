const fs = require("fs");
const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const findDistance = require("./distance");
const ZIPCODE_FILENAME = "data.json";

class SearchApi {
  constructor() {
    var filename = `${__dirname}/${ZIPCODE_FILENAME}`;

    this.stream = fs.createReadStream(filename, {
      flags: "r",
      encoding: "utf-8",
    });
  }
  getPipeline(onData) {
    return chain([this.stream, parser(), streamArray(), onData]);
  }
  static search(searchFn, filterFn) {
    const codes = new SearchApi();
    return new Promise((resolve, reject) => {
      let results = [];
      const pipeline = codes.getPipeline(searchFn);

      pipeline.on("data", (d) => results.push(d));
      pipeline.on("finish", () =>
        resolve(
          typeof filterFn === "function" ? results.filter(filterFn) : results
        )
      );
      pipeline.on("error", reject);
    });
  }
  static searchZip(partial, filterFn) {
    return SearchApi.search(({ value }) => {
      if (value.zip.indexOf(partial) === 0) {
        return value;
      }
    }, filterFn);
  }

  static searchCity(partial, filterFn) {
    return SearchApi.search(({ value }) => {
      const cities = [value.primary_city, ...(value.acceptable_cities || [])];
      if (
        cities.some(
          (city) => city.toLowerCase().indexOf(partial.toLowerCase()) === 0
        )
      ) {
        return value;
      }
    }, filterFn);
  }

  static searchLatLong({ lat, long, distance, unit = "M" }, filterFn) {
    return SearchApi.search(({ value }) => {
      if (
        Boolean(
          distance >=
            findDistance(lat, long, value.latitude, value.longitude, unit)
        )
      ) {
        return value;
      }
    }, filterFn);
  }
}

module.exports = SearchApi;
