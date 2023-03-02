export const checkForInvalidId = (id, keyArray) => {
    if (!keyArray.includes(id)) throw new Error(`Invalid element ID ${id}`);
}

export const updateValue = (obj, key, value, event) => {
    obj[key] = event.target.type === 'number' ? Number(value) : value;
}