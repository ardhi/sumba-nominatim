async function searchFreeform (path, ...args) {
  const { importPkg } = this.app.bajo
  const { isEmpty } = this.lib._
  const { search } = this.app.sumbaNominatim
  const input = await importPkg('bajoCli:@inquirer/input')
  const { getOutputFormat, writeOutput } = this.app.bajoCli
  const format = getOutputFormat()
  let query = args[0]
  if (isEmpty(query)) {
    query = await input({
      message: this.print.write('Please enter a query:')
    })
  }
  if (isEmpty(query)) return this.print.fail('Query must be provided!', { exit: this.app.bajo.applet })
  const spinText = 'Fetching...'
  const spin = this.print.spinner({ showCounter: true }).start(spinText)

  let result
  try {
    result = await search({ query })
    spin.info('Done!')
  } catch (err) {
    spin.fatal('Error: %s', err.message)
  }
  await writeOutput(result, path, format)
}

export default searchFreeform
