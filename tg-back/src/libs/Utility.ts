export function setDefaultWhenEmpty(data: string, defaultData: string) {
    if(!data) {
        data = defaultData
    }

    return data
}