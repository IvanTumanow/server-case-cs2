export function convertQueryToSelect(query: Record<string, string>): Record<string, boolean> | undefined {
    if (!query.hasOwnProperty('select')) return undefined

    const properties: string[] = query['select'].split(',').filter(q => q.trim() !== '')

    if (properties.length === 0) return undefined

    return Object.fromEntries(properties.map(p => [p, true]))
}