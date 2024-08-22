import bcrypt from "bcrypt";

//hash al password
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//comparar password (true o false)
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword };