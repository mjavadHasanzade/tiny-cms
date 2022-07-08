import bcrypt from "bcrypt";

function decode(hash: string, password: string) {
  return bcrypt.compareSync(password, hash);
}

function encode(password: string) {
  return bcrypt.hash(password, 10);
}

export { decode, encode };
