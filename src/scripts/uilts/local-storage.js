export function getStorageRecord (key, defaultValue = null) {
    const record = localStorage.getItem(key);
    if (record) {
        try {
            const parsedRecord = JSON.parse(record);
            return parsedRecord;
        } catch (error) {
            localStorage.removeItem(key);
            return defaultValue;
        }
    }
    return defaultValue;
}
