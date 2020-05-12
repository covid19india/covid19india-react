from mapbox import Geocoder

import json
import urllib
import time
from random import gauss
from collections import Counter


def read_data(path="https://api.covid19india.org/resources/resources.json", url=True, key="resources"):
    if url:
        request = urllib.request.urlopen(path)
        data = json.load(request)

    else:
        with open(path) as request:
            data = json.load(request)

    inputDict = data[key]
    return inputDict


def get_data_breakdown(inputDict, stats=True, test=True):
    category_ctr = []
    city_ctr = []
    state_ctr = []
    city_coords = {}
    cities = set()
    states = set()

    analysis = {}

    for i, entry in enumerate(inputDict):

        # if test and i==10: break # For test runs

        if stats:
            category_ctr.append(entry["category"])
            city_ctr.append([entry["city"], entry["state"]])
            state_ctr.append(entry["state"])
            states.add(entry["state"])

    if stats:
        cat_c = Counter(category_ctr)
        # print(f'\nCategory counter: \n{dict(cat_c)}\n\nUnique categories = {len(cat_c)}\n\n')
        statewise = Counter(list(zip(*city_ctr))[1])
        districts = 0
        distribution = {}
        for s in states:
            curr_s = [e for e in city_ctr if e[1] == s]
            district_ctr = Counter(list(zip(*curr_s))[0])
            distribution[s] = dict(district_ctr)
            districts += len(district_ctr)
        # print(f'State wise spread:\n{dict(Counter(list(zip(*city_ctr))[1]))}\nDistrict wise spread:\n{distribution}\n\n')
        analysis = [{
            "count": len(cat_c),
            "spread": dict(cat_c)
        }, {
            "count": len(statewise),
            "spread": dict(statewise)
        }, {
            "count": districts,
            "spread": distribution
        }]

        pretty = set()
        for e in city_ctr:
            pretty.add(' '.join((e[0], e[1])))
        print(len(list(pretty)))
    return analysis, list(pretty)


def write_analysis(stats, simple=False, path="./analysis.json"):
    if simple:
        outputDict = {
            "resources": stats
        }
    else:
        outputDict = {
            "Category": stats[0],
            "State": stats[1],
            "District": stats[2]
        }

    with open(path, 'w') as json_file:
        json.dump(outputDict, json_file, indent=4)


def write_data(res, path="./geoResources.json"):
    outputDict = {
        "type": "FeatureCollection",
                "features": res
    }

    with open(path, 'w') as json_file:
        json.dump(outputDict, json_file, indent=4)


def get_icon(category: str) -> str:
    if category == 'Accommodation and Shelter Homes':
        return "homes"
    elif category == 'Ambulance':
        return "ambulance"
    elif category == 'Community Kitchen':
        return "kitchen"
    elif category == 'CoVID-19 Testing Lab':
        return "lab"
    elif category == 'Delivery [Vegetables, Fruits, Groceries, Medicines, etc.]':
        return "delivery"
    elif category == 'Fire Brigade':
        return "fire"
    elif category == 'Free Food' or category == 'Free Food & Essentials':
        return "food"
    elif category == 'Fundraisers':
        return "fund"
    elif category == 'Government Helpline':
        return "helpline"
    elif category == 'Hospitals and Centers':
        return "hospital"
    elif category == 'Mental well being and Emotional support':
        return "mental-health"
    elif category == 'Police':
        return "police"
    elif category == 'Senior Citizen Support':
        return "seniors"
    elif category == 'Transportation':
        return "transport"
    elif category == 'Quarantine Facility':
        return "quarantine"
    elif category == 'Other':
        return "other"
    else:
        return "other"


def scrape_url(entries, start=33, end=None):
    token = "pk.eyJ1IjoiYXNobWFwNGdkIiwiYSI6ImNrOXBjb2k2dDA5YW4zb24xb3A2cWs5YXYifQ.3qtCEWPKAOEftYEEUDfDSQ"
    g = Geocoder(access_token=token)

    processed = []
    skipped = []

    for i, entry in enumerate(entries):
        print(i)
        if "www.google.com/maps" not in entry["contact"]:
            skipped.append(entry)
            continue

        isHealthcare = 0

        reg = entry["contact"][start:end].split(',')

        geom = {
            "type": "Point",
            "coordinates": [
                    reg[1],
                    reg[0]
            ]
        }

        icon = get_icon(entry["category"])

        if(entry["category"] == "CoVID-19 Testing Lab" or entry["category"] == "Hospitals and Centers"):
            isHealthcare = 1

        reverse = g.reverse(reg[1], reg[0])
        target = reverse.geojson()

        if target["features"]:
            q_name = target["features"][0]["text"]
            q_addr = target["features"][0]["place_name"]
        else:
            q_addr = ""
            q_name = ""

        prop = {
            "id": i,
            "name": entry["nameoftheorganisation"],
            "desc": entry["descriptionandorserviceprovided"],
            "geoTag": q_name,
            "addr": q_addr,
            "state": entry["state"],
            "phone": entry["phonenumber"],
            "contact": entry["contact"],
            "priority": isHealthcare,
            "icon": icon
        }

        processed.append({
            "type": "Feature",
            "properties": prop,
            "geometry": geom
        })

    return processed, skipped


def make_boundaries(cityList, lvl1=['district'], lvl2=['place']):
    token = "pk.eyJ1IjoiYXNobWFwNGdkIiwiYSI6ImNrOXBjb2k2dDA5YW4zb24xb3A2cWs5YXYifQ.3qtCEWPKAOEftYEEUDfDSQ"

    g = Geocoder(access_token=token)
    failed = []
    bbox_dict = {}

    for i, city in enumerate(cityList):
        if "PAN" in city:
            continue

        response = g.forward(city, types=lvl1, country=['in'], limit=1)

        if not response.json()["features"]:
            response = g.forward(city, types=lvl2, country=['in'], limit=1)

        if not response.json()["features"]:
            # print(f'failed {i}')
            failed.append(city)
            continue

        # reset = int(response.headers["X-Rate-Limit-Reset"])
        # s_time= (reset - int(time.time()) + 1)
        # if s_time > 0:
        #     print(f'sleeping for {s_time}')
        #     time.sleep(s_time)

        if i and not i % 500:
            print("sleep time")
            time.sleep(60)

        feat = response.json()["features"][0]
        city_center = feat["center"]

        if 'bbox' in feat.keys():
            city_bbox = feat["bbox"]
        else:
            city_bbox = []
        #     print(f'Failed to get bbox for {city}, using {city.split()[-1]} instead')
        #     response = g.forward(city.split()[-1] , types=['region'], country=['in'], limit=1 )
        #     feat = response.json()["features"][0]["bbox"]

        bbox_dict[city] = {"bbox": city_bbox,
                           "center": city_center}

    print("sleep time")
    print(
        f'Processed: {len(bbox_dict)}/{len(cityList)}\nAborted: {len(failed)}/{len(cityList)}')

    time.sleep(30)

    return bbox_dict, failed


def make_geojson(entries, refs):
    token = "pk.eyJ1IjoiYXNobWFwNGdkIiwiYSI6ImNrOXBjb2k2dDA5YW4zb24xb3A2cWs5YXYifQ.3qtCEWPKAOEftYEEUDfDSQ"

    g = Geocoder(access_token=token)

    processed = []
    skipped = []
    verify = []

    for i, entry in enumerate(entries):
        if not i % 100:
            print(f'Feature: {i}')
        # reset vars
        q_name = ''
        q_addr = ''
        geom = {}
        isHealthcare = 0

        city = ' '.join((entry["city"], entry["state"]))
        query = ', '.join((entry["nameoftheorganisation"], entry["city"]))

        # Skipped entries

        if city not in refs:
            skipped.append(entry)
            continue
        if "PAN" in city:
            skipped.append(entry)
            continue
        if (entry["city"] == "Delhi" and entry["category"] == "Free Food"):
            skipped.append(entry)
            continue

        c_bbox = refs[city]["bbox"]     # [lng, lat, lng, lat]
        c_center = refs[city]["center"]  # [lng, lat]

        if c_bbox != []:
            resp = g.forward(query, country=["in"], bbox=c_bbox, limit=1)
        else:
            resp = g.forward(query, country=["in"], limit=1)

        target = resp.geojson()

        # Make flags
        icon = get_icon(entry["category"])

        if(entry["category"] == "CoVID-19 Testing Lab" or entry["category"] == "Hospitals and Centers"):
            isHealthcare = 1

        # Get data
        if target["features"]:  # condition -> non empty response
            geom = target["features"][0]["geometry"]
            q_name = target["features"][0]["text"]
            q_addr = target["features"][0]["place_name"]
        else:                       # else -> empty response - use big brain trickery
            verify.append(i)
            if c_bbox:
                sd = min(abs(c_bbox[0]-c_bbox[2])/8,
                         abs(c_bbox[1]-c_bbox[3])/8)
            else:
                sd = c_center[0]*0.0004

            lng = gauss(c_center[0], sd)
            lat = gauss(c_center[1], sd)

            geom = {
                "type": "Point",
                "coordinates": [
                    lng,
                    lat
                ]
            }
            q_addr = city
            q_name = ""

        prop = {
            "id": i,
            "name": entry["nameoftheorganisation"],
            "desc": entry["descriptionandorserviceprovided"],
            "geoTag": q_name,
            "addr": q_addr,
            "state": entry["state"],
            "phone": entry["phonenumber"],
            "contact": entry["contact"],
            "priority": isHealthcare,
            "icon": icon
        }

        processed.append({
            "type": "Feature",
            "properties": prop,
            "geometry": geom
        })

    return processed, skipped, verify


def main():
    """    0. Import essentials data    """
        
    api_data = read_data(path='./resources.json', url=False)


        
    """    1. Generate list of full City names and get properties --bbox --center    """
        
    analysis, pretty_cities = get_data_breakdown(api_data)


        
    write_analysis(analysis)
        
    write_analysis(pretty_cities, simple=True, path="./cityList.json")


        
    city_list = read_data(path='./cityList.json', url=False)
        
    # Replace spotted typos
        
    city_list.append("Sri Ganganagar Rajasthan")
        
    city_list.remove("Sriganganagar Rajasthan")
        
    city_list.append("Muzaffarpur Bihar")
        
    city_list.remove("Muzzafarpur Bihar")
        
    print(f'City_list entries {len(city_list)}')  # 1291


        
    city_bounds, failed = make_boundaries(city_list)


        
    write_analysis(city_bounds, simple=True, path="./cityDict.json")
        
    write_analysis(failed, simple=True, path="./failed1.json")


        
    city_dict = read_data(path='./cityDict.json', url=False)
        
    # second pass
        
    city_rem = list(set(city_list) - set(city_dict.keys()))


        
    # SANITY CHECK - if failed list == original - processed
        
    excl = len([city for city in city_rem if "PAN" in city])  # = 10
        
    print("checking for continuity")
        
    assert(len(set(city_list) - set(city_dict.keys())) - excl == len(failed))


        
    # # print([c.split()[-1] for c in city_rem if c.split()[-1] != "Kerala"])
        
    city_bounds2, ffs = make_boundaries(
        
        failed, lvl1=['place', 'locality', 'neighborhood'], lvl2=None)


        
    write_analysis(city_bounds2, simple=True, path="./cityDict2.json")
        
    write_analysis(ffs, simple=True, path="./failed_again.json")


        
    """    2. Time to geocode individual entries. finally.    """
        
    # read in the dicts


        
    first_pass = read_data(path='./cityDict.json', url=False)
        
    second_pass = read_data(path='./cityDict2.json', url=False)
        
    geo_references = {**first_pass, **second_pass}


        
    # SANITY CHECK - no overlapping refs
        
    assert(len(first_pass) + len(second_pass)
        
        == len(set(geo_references.keys())))


        
    processed, skipped, verify = make_geojson(api_data, geo_references)
        
    # Print progress
        
    print(f'Processed: {len(processed)}')
        
    print(f'Skipped: {len(skipped)}')
        
    print(f'Need to verify: {len(verify)}')


        
    # crtl + S
        
    write_data(processed)
        
    write_analysis(skipped, simple=True, path="./skipped_geocoding.json")
        
    write_analysis(verify, simple=True, path="./verifyList.json")


        
    """     3. Scrap existing coordinate from contact urls.     """
        
    skipped = read_data(path="./skipped_geocoding.json", url=False)


        
    delhi, others = scrape_url(skipped)


        
    assert(len(delhi)==635)


        
    write_data(delhi, path="geoDelhi.json")
        
    write_analysis(others, simple=True, path="./skipped.json")




if __name__ == "__main__":
    # main()

    data = read_data()
    zones = read_data(path="https://api.covid19india.org/zones.json", key="zones")

    r = Counter([i["city"] for i in data])
    z = Counter([i["district"] for i in zones])
    lst = [i["district"] for i in zones]

    print(r.most_common(10), z.most_common(10))

    diff = r-z

    rg =  Counter([i["city"] for i in data if i["city"] not in lst])

    print("\n\n\n",rg,"\n\n\n")
    print(len(dict(rg)), len(list(rg.elements())))
    
    print(len(diff))

    # main = read_data(path='./src/geoResources_unmerged.json', url=False)
    # delhi = read_data(path='./geoDelhi.json', url=False)

    # # Offset = 457

    # for f in delhi:
    #     if f["properties"]["id"]>457:
    #         f["properties"]["id"]+=221-25
    #     else:
    #         f["properties"]["id"]+=220-25

   
    # res = sorted(main+delhi, key = lambda i: i["properties"]["id"])

    # test=Counter([ i["properties"]["id"] for i in res ])
    # print(test)
    # write_data(res, path="./geoResources.json")
    # p = read_data(path='./geoResources.json', url=False)
    # tmp = Counter([ i["properties"]["id"] for i in p ])
    # print(tmp)