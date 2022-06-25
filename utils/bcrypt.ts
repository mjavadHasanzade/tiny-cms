import bcrypt from "bcrypt";

function decode(hash: string, password: string) {
  return bcrypt.compareSync(password, hash);
}

export { decode };
