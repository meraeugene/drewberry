export type Profile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string;
  favorite_genres: string[];
  plan: "Dream Pass" | "Royal Pass";
  created_at: string;
};
