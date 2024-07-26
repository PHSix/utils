export const env = typeof process === 'undefined'
  ? {}
  : Object.entries(process.env).reduce<Record<string, string>>((object, acc) => {
    if (!acc[1])
      return object

    object[acc[0].toLowerCase()] = acc[1]

    return object
  }, {})

export default env
