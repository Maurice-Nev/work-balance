import { z } from "zod";

export const CommentFormSchema = z.object({
  comment: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  rating: z.preprocess((val) => {
    // Wenn val ein leerer String ist, gib null zurück (optional)
    if (typeof val === "string" && val.trim() === "") return null;
    return Number(val);
  }, z.number().min(0, { message: "Rating can't be lower than 0" }).max(5, { message: "Rating can't be higher than 5" })),
});
