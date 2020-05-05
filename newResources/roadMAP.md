# Mapping Essentials - Roadmap

## Timeline

| #   | Task                                                                                          |                                   | Duration |
| --- | --------------------------------------------------------------------------------------------- | --------------------------------- | -------- |
| 1   | Refactor current json with geo coded data                                                     | 1 dev                             | <1 day   |
| 2   | Verify entries with low confidence                                                            | Validation team of 15: <=300 each | 2-4 days |
| 3   | Map nearest entries (already implemented)                                                     | 1 dev                             | <1 day   |
| 4   | Integrate into the page so that both map and current table views are accessible               | 1 dev                             | 1 day    |
| 5   | Add built in _sidebar_ to the map to show the filtered data (instead of tooltip on map above) | 2-3 devs                          | 3 days   |
| 6   | _Optional_: add-on other map related features such as routing if deemed necessary             | 2-3 devs                          | 5 days   |

## Data

So this is the major task that needs to be solved to make this happen.

Lets first look at the python library and API.

The _geopy_<sup> [1](https://geopy.readthedocs.io/en/latest/)</sup> library supports multiple
geocoding providers. Most of them aren't free.The test run used the _Nominatim_ API which is
free of charge but has a request limit of ~2000. Luckily there is an easy work around to get infinite
requests - reset router so the device gets a new IP address :D .

> **Search result for _"Mumbai International Airport"_**  
> {'place_id': 90697496, 'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright', 'osm_type': 'way', 'osm_id': 22826676, 'boundingbox': ['19.0790885', '19.1013227', '72.8438292', '72.8818362'], 'lat': '19.0902005', 'lon': '72.86380844765398', 'display_name': 'Chhatrapati Shivaji International Airport, Sahar Elevated Road, Sahar Gaon, K/E Ward, Zone 3, Mumbai, Mumbai Suburban, Maharashtra, 400 059, India', 'class': 'aeroway', 'type': 'aerodrome', 'importance': 0.7822272935412413, 'icon': 'https://nominatim.openstreetmap.org/images/mapicons/transport_airport2.p.20.png',  
> '**address**': {'aerodrome': 'Chhatrapati Shivaji International Airport', 'road': 'Sahar Elevated Road', 'neighbourhood': 'Sahar Gaon', 'suburb': 'K/E Ward', 'city_district': 'Zone 3', 'city': 'Mumbai', 'state_district': 'Mumbai Suburban', 'state': 'Maharashtra', 'postcode': '400 059', 'country': 'India', 'country_code': 'in'},  
> '**extratags**': {'ele': '11', 'wikidata': 'Q504368', 'aerodrome': 'international', 'wikipedia': 'en:Chhatrapati Shivaji International Airport', 'rank_aci:2016': '29', 'aerodrome:type': 'public'},  
> '**namedetails**': {'iata': 'BOM', 'icao': 'VABB', 'name': 'Chhatrapati Shivaji International Airport', 'name:kn': 'ಛತ್ರಪತಿ ಶಿವಾಜಿ ಇಂಟರ್\u200cನ್ಯಾಶನಲ್ ಏರ್\u200cಪೋರ್ಟ್', 'name:zh': '贾特拉帕蒂·希瓦吉国际机场'}}

These are all the information you can extract from a geocode (using nominatim, **bold** key value
pairs for other APIs may differ), but we only need the _lat_ and _lon_ entries. The _address_ can
be used if need be.

\*Note on the _importance_ key - refer to [[1]](https://lists.openstreetmap.org/pipermail/geocoding/2013-August/000915.html) and [[2]](https://lists.openstreetmap.org/pipermail/geocoding/2013-August/000916.html) for more details on how its determined.

MapBox is another (relatively) free geocoding service provider. Has a cap of 100k requests a month,
which I think is more than enough. You need to create a free account first up to get the API key.
One of the advantages of this is that it lets your set a location bias. This would be very useful for
more generic entries in the current database. This means we can get the result closest to the bias we
feed rather than just the best match. (e.g. A search query of "Airport" with a location bias of Mumbai
would return a the Mumbai International Airport)

Methods to accurately transform the data is discussed later in **Strategy**

The new data is stored as a specialized JSON format, geoJSON, the conventional (and convenient) data
structure for storing geo data.

wrt to the map itself, we use the Leaflet package with OpenStreetMaps; both opensource and free.
The different 'skins' (aka TileLayers) can be found [here](https://leaflet-extras.github.io/leaflet-providers/preview/).
_CartoDB.voyager_ and _CartoDB.darkMatter_ seem to be the best fit for the light and dark modes of the website

## Strategy

### Data Processing

For each entry<sup>2</sup>:

1. Get the latlng for the _city_ value to set as bias
2. Get latlong for the entry using the _nameoftheorganisation_ value with the bias from (1)
3. If request fails, extract postcode and lookup latlng in the postcode dataset<sup>[3](https://www.geonames.org/postal-codes/postal-codes-india.html)</sup>
4. If postcode extraction also fails, use city latlng value.
5. Assign a new _icon_ value based on the category.
6. Dump it into the new json using the template below.

Note<sup> 2</sup> - Given we use the MapBox API. If we stick to Nominatim instead, step 1 is skipped
and 2 will be executed without the location bias from 1.

Note<sup> 3</sup> - There is an API for this as well, but they also provide raw data in txt format for pan
india postcodes

```
# geoJSON format
geoData = {
            "type": "FeatureCollection",
            "features": {
                "type": "Feature",
                "properties": {
                    "name": -name- ,
                    "desc": -desc-,
                    "addr": -addr-,
                    "phone": -number-,
                    "contact": -contact-,
                    "priority": -boolean-,
                    "icon": -icon_name-
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-lon-, -lat-]
                }
            },
            {},
            {},
            {},
            {}
        }
```

> Categories can be coded as these icon names in the geoJSON (can be altered ofc)  
> icon_names = [

               "kitchen",
               "lab",
               "homes",
               "food",
               "fund",
               "mental-health",
               "helpline",
               "hospital",
               "delivery",
               "other",
               "seniors",
               "police",
               "ambulance",
               "fire",
               "quarantine",
               "other"
             ]

The reason for coding the categories slightly differently is so that we can have the .svg files with
the same name as the icon values. This lets us automatically assign different icons based on category.

### Implementing the Map

Using Leaflet (and extensions of it), we create, and manipulate the map. You might have noticed an added
_priority_ key in the properties dict above. This is to distinguish between the medical (priority)
essentials and the rest just incase the Hospitals or Testing Labs get bumped down the nearest lists.
We do two different nearest k neighbor searches, one for each priority. In the test run 5 of the nearest
priority entries were shown, no matter the distance from the input location. 10 of the rest were shown,
but they were capped at a 100km range ( i.e. only the k results within {100}km are shown if the 10 nearest
are not within {100}km )

This map can either be a full page alternative to the current essentials table or just a view you can switch
between. In the former case, the current essentials table page could just be migrated to a secondary page
where users can be directed to from the map if they want to get a bigger picture.

### Extensions

There are packages for routing and other map related stuff we could explore. But I think the only one we
would need is a sidebar within the map to show the details for the entries better. Other packages may add
some functionality, but the main goal of the map is to feed the user just the data they are looking for as
opposed to spamming them with loads of information.

The _sidebar_ could also have the option to to change the constants for the knn search using a slider.

## Whats needed

1. Geocoding
2. Geocoding
3. Geocoding

Jokes aside, since the bulk of the implementation has already been done, almost all the work needed for this
feature is to refactor the current resources database. The 5-10% of the work is essentially just formatting.

Ideally new entries from now on should include a mandatory postcode value since its the easiest method of
geocoding (without the need of the fancy APIs or spellchecks). These can just be Vlookup'ed from the postcode
dataset.

Every time theres a new type of category, new icons need to be pushed and more work may (or may not) be
required with the database. So it'd be advisable to fix the current categories and try not to alter it too much.

Help with the sidebar and other optional extras would be ideal to finish this faster and have another eye on it.
As with other features and PRs help reviewing and optimizing code is also needed.

## Output

A map that takes in user input (either current location or query) and displays the nearest essentials wrt the user.

PR [#1248](https://github.com/covid19india/covid19india-react/pull/1248) has a [preview](https://covid19india-react-r4fhv1jur.now.sh/essentials)
deployed along with some screenshots. It'll describe it much better than I can.

## Success Metric Analysis

Motivation behind this was to reduce the information overload for the user. Say they want to check out essentials
in their city. The table is ought to grow larger day by day so rather than the user scroll through loads of entries
or keep searching for different categories in their city, why not just display the most accessible ones wrt them? What
if their city is not even listed yet? What if they live near a state border and their closest essentials X is in their
neighboring state? These are hypothetical questions, but edge cases nonetheless.

A metric to evaluate would be the time taken searching for the most accessible essentials in a particular location with
the map vs current table.
