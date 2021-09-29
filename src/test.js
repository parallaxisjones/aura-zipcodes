const { handler } = require("./index");
const search = require("./search");

describe("basic tests", () => {
  test("handler function exists", () => {
    expect(typeof handler).toBe("function");
  });

  test("search handles zip", () => {
    search
      .searchZip("01001")
      .then((data) => {
        expect(JSON.stringify(data)).toBe(
          JSON.stringify([
            {
              zip: "01001",
              type: "STANDARD",
              primary_city: "Agawam",
              acceptable_cities: null,
              unacceptable_cities: null,
              state: "MA",
              county: "Hampden County",
              timezone: "America/New_York",
              area_codes: "413",
              latitude: "42.06",
              longitude: "-72.61",
              country: "US",
              estimated_population: "14021",
            },
          ])
        );
      })
      .catch(console.error);
  });

  test("search handles city", () => {
    search
      .searchCity("Agawam")
      .then((data) => {
        expect(JSON.stringify(data)).toBe(
          JSON.stringify([
            {
              zip: "01001",
              type: "STANDARD",
              primary_city: "Agawam",
              acceptable_cities: null,
              unacceptable_cities: null,
              state: "MA",
              county: "Hampden County",
              timezone: "America/New_York",
              area_codes: "413",
              latitude: "42.06",
              longitude: "-72.61",
              country: "US",
              estimated_population: "14021",
            },
          ])
        );
      })
      .catch(console.error);
  });

  test("search handles latlong", () => {
    search
      .searchLatLong({
        lat: "42.06",
        long: "-72.61",
        distance: 1,
      })
      .then((data) => {
        expect(JSON.stringify(data)).toBe(
          JSON.stringify([
            {
              zip: "01001",
              type: "STANDARD",
              primary_city: "Agawam",
              acceptable_cities: null,
              unacceptable_cities: null,
              state: "MA",
              county: "Hampden County",
              timezone: "America/New_York",
              area_codes: "413",
              latitude: "42.06",
              longitude: "-72.61",
              country: "US",
              estimated_population: "14021",
            },
          ])
        );
      })
      .catch(console.error);
  });

  test("search handles filtering", () => {
    search
      .searchLatLong(
        {
          lat: "42.06",
          long: "-72.61",
          distance: 10,
        },
        (result) => parseInt(result.estimated_population) < 10000
      )
      .then((data) => {
        expect(data.length).toBe(29);
      })
      .catch(console.error);

    search
      .searchLatLong({
        lat: "42.06",
        long: "-72.61",
        distance: 10,
      })
      .then((data) => {
        expect(data.length).toBe(44);
      })
      .catch(console.error);
  });
});
