import { z } from "zod";


export const categories = [
  "Action",
  "Adventure",
  "RPG",
  "Simulation",
  "Strategy",
  "Casual",
  "Horror",
  "Multiplayer",
  "Others",
];

export const userOnboardingSchema = z.object({
  avatar: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters."),
  fullName: z.string().min(1, "Full name is required."),
  gender: z.enum(["male", "female", "other", "prefer not to say"]),
  experience: z.enum(["beginner", "intermediate", "expert", "ninja"]),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  bio: z.string().max(200, "Bio must be under 200 characters."),
  favouriteGame: z.array(
    z.object({
      game: z.string().min(1, "Game name is required"),
      username: z.string().min(1, "In-game username is required"),
    }),
  ),
  favouriteCategory: z.array(z.enum(categories)),
  socials: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
  }),
});
