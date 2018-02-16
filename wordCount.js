const fs = require('fs')

const logFile = 'api.log'

/**
 * We could use an array of search terms, so we can pass in
 * any number of terms to count.
 */
const searchTerms = new Map([
  ['adbutler.com', 3],
  ['activeboard.com', 4],
  ['testing.com', 3],
])

/**
 * This function takes in a file and search terms, and counts all instances
 * of each search term and then returns a Map of the results.
 * @param {String} file Relative path to file
 * @param {Array} search Array of search terms
 */
const countOccurrences = (file, search) => {
  if (!file) {
    return new Error('A file is required.')
  }
  if (!search) {
    // eslint-disable-next-line quotes
    return new Error(`An Map of search terms and expected counts is required, (ie: Map([['one', 1], ['two', 2], ['three', 3]])`)
  }
  const rows = file.split('\n')
  const count = rows.reduce((acc, row) => {
    search.forEach((_, term) => {
      if (row.indexOf(term) !== -1) {
        let current = acc.get(term)
        // If the term hasn't been counted yet, add it to result set
        if (!current) {
          acc.set(term, 1)
          return
        }
        // Otherwise, increment the count
        current += 1
        acc.set(term, current)
      }
    })
    return acc
  }, new Map())
  return count
}

fs.readFile(logFile, 'utf8', (err, data) => {
  if (err) {
    throw new Error(`Problem reading file: ${err}`)
  }
  const results = countOccurrences(data, searchTerms)
  // eslint-disable-next-line no-console
  results.forEach((count, term) => console.log(`
    SEARCH TERM: ${term}
    EXPECTED: ${searchTerms.get(term)}
    FOUND: ${count}
  `))
})
