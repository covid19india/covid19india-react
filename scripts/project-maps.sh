#!/bin/bash

WIDTH=432
HEIGHT=488

SCRIPT_DIR=$(dirname $0)
MAPS_DIR=${SCRIPT_DIR}/../public/maps
OUTPUT_DIR=${SCRIPT_DIR}/../public/projected_maps

mkdir -p "${OUTPUT_DIR}"

for file in ${MAPS_DIR}/*.json; do
    fn=$(basename ${file})
    topo2geo districts=- -i "$file" | geoproject "d3.geoMercator().fitSize([${WIDTH}, ${HEIGHT}], d)" | geo2topo districts=- -o "${OUTPUT_DIR}/${fn}"
done

topomerge states=districts -k 'd.properties.st_nm' "${OUTPUT_DIR}/india.json" -o "${OUTPUT_DIR}/india_merged.json"

mv "${OUTPUT_DIR}/india_merged.json" "${OUTPUT_DIR}/india.json"
prettier --loglevel silent --write "$OUTPUT_DIR"

