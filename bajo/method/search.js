async function search (params = {}, extra = {}) {
  const { pick } = this.app.bajo.lib._
  const { fetch } = this.app.bajoExtra
  const endpoint = `${this.config.remoteUrl}/search`
  const opts = {
    query: {}
  }
  if (params.query) {
    opts.query = pick(params, ['limit'])
    opts.query.q = params.query
  } else opts.query = pick(params, ['limit', 'amenity', 'street', 'city', 'county', 'state', 'country', 'postalcode'])
  opts.query.format = 'json'
  opts.query.limit = opts.query.limit ?? this.config.limit
  if (extra.polygon) {
    opts.query.polygon_geojson = 1
    opts.query.polygon_threshold = opts.query.polygonThreshold ?? this.config.polygonThreshold
  }
  return await fetch(endpoint, opts, { agent: this.config.userAgent })
}

export default search
