const forbiddenFields: string[] = ['password']

export function convertQueryToSelect(query: Record<string, string>): Record<string, boolean> | undefined {
    if (!query.hasOwnProperty('select')) return undefined

    const properties: string[] =
        query['select']
            .split(',')
            .filter(q => q.trim() !== '')
            .filter(q => !forbiddenFields.includes(q))

    if (properties.length === 0) return undefined

    return Object.fromEntries(properties.map(p => [p, true]))
}