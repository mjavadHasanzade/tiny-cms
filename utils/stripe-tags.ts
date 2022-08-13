const stripTags = (str: string) => {
  const regex = /(<([^>]+)>)/gi;
  return str.replace(regex, "");
};

export default stripTags