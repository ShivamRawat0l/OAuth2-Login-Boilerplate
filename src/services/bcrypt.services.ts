import bcrypt from "bcryptjs";

const cryptPassword = async (password: any): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = async (
  plainPass: string,
  hashword: string
): Promise<boolean> => {
  const isPasswordMatch = await bcrypt.compareSync(plainPass, hashword);
  return isPasswordMatch;
};

export { cryptPassword, comparePassword };
