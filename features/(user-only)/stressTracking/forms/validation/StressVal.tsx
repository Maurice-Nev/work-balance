import { z } from "zod";

export const StressFormSchema = z.object({
  stress: z.preprocess((val) => {
    // Wenn val ein leerer String ist, gib null zurück (optional)
    if (typeof val === "string" && val.trim() === "") return null;
    return Number(val);
  }, z.number().min(0, { message: "Stress can't be lower than 0" }).max(10, { message: "Stress can't be higher than 10" })),
  department_id: z.string().nonempty("Department musst be selected"),
});
