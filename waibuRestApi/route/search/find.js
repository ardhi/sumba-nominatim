const find = {
  schema: false,
  handler: async function (req, reply) {
    const { camelCase, omit } = this.app.bajo.lib._
    const { parseObject } = this.app.bajo
    const { search } = this.app.sumbaNominatim
    const { parseFilter } = this.app.waibu
    const filter = parseFilter(req)
    const headers = parseObject(req.headers, { parseValue: true })
    const extra = { polygon: headers['x-polygon'] }
    let data = await search({ query: filter.query, limit: filter.limit }, extra)
    data = data.map(d => {
      const nd = {}
      for (const key in d) {
        nd[camelCase(key)] = d[key]
      }
      nd.id = nd.placeId
      nd.bbox = nd.boundingbox.map(b => parseFloat(b))
      nd.lng = parseFloat(nd.lon)
      nd.lat = parseFloat(nd.lat)
      nd.addressType = nd.addresstype
      if (nd.geojson) nd.polyCoords = nd.geojson.coordinates
      return omit(nd, ['boundingbox', 'lon', 'geojson', 'addresstype', 'placeId'])
    })
    return { data }
  }
}

export default find
