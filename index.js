async function factory (pkgName) {
  const me = this

  class SumbaNominatim extends this.lib.Plugin {
    static alias = 'nominatim'
    static dependencies = ['bajo-extra']

    constructor () {
      super(pkgName, me.app)
      this.config = {
        waibu: {
          title: 'OpenStreetMap Nominatim',
          prefix: 'nominatim'
        },
        remoteUrl: 'https://nominatim.openstreetmap.org',
        limit: 10,
        polygonThreshold: 0.009
      }
    }

    search = async (params = {}, extra = {}) => {
      const { pick } = this.lib._
      const { fetchUrl } = this.app.bajoExtra
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
        opts.query.polygon_threshold = extra.polygonThreshold ?? this.config.polygonThreshold
      }
      return await fetchUrl(endpoint, opts, { agent: this.config.userAgent })
    }
  }

  return SumbaNominatim
}

export default factory
