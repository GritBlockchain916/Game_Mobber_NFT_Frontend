

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function jsonUpdate(obj, name, value) {
  new_obj = deepCopy(obj);
  new_obj[name] = value;
  return new_obj;
}


