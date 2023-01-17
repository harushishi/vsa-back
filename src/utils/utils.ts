function parseToken(token: string) {
  if (!token.startsWith("Bearer ")) {
    throw new Error("bad token");
  }

  const [_, parsedToken] = token.split(" ");

  return parsedToken;
}

export { parseToken };
