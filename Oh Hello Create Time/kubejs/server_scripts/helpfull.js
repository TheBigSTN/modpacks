// priority: 0

function list(e) {
  const l = [];
  for (const i in e) l.push(i);
  l.sort();
  for (const item of l) {
    if (typeof e[item] === "function") console.log("function " + item + "()");
    else if (typeof e[item] === "number") console.log("number   " + item);
    else if (typeof e[item] === "string") console.log("string   " + item);
    else if (typeof e[item] === "bigint") console.log("bigint   " + item);
    else if (typeof e[item] === "boolean") console.log("boolean  " + item);
    else if (typeof e[item] === "object") console.log("object   " + item);
  }
}
global.list = list;
