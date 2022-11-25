function objectExtracter(obj: {}, minus: Array<string>): Array<string> {
  let objects = Object.keys(obj);
  objects = objects.filter((el) => !minus.includes(el));
  return objects;
}

export default objectExtracter;
