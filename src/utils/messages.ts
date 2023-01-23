export const err_codes = {
  not_found: "P2025",
  unique_constraint: "P2002",
};

export const msgs = {
  internal: "500. Internal error.",
  email_taken: "Email already in use.",
  username_taken: "Username already in use.",
  bad_syntax: "Bad syntax.",
  inv_credentials: "Either the email or password is wrong, please try again.",
  followed: "User followed.",
  unfollowed: "User unfollowed.",
  user_not_found: "User not found.",
  post_not_found: "Post not found.",
  comment_not_found: "Comment not found.",
  profile_not_found: "Profile not found.",
  no_file: "File not uploaded.",
  empty_post: "Post can't be empty.",
  forbidden: "forbidden.",
  s3_problem: "S3 Problem.",
  unknown_filter: "Such filter does not exist.",
  has_profile: "This user already have an active profile.",
};
