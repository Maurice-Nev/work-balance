import { Tables, TablesInsert, TablesUpdate } from "./database.types";

export type User = Tables<"user">;
export type Role = Tables<"role">;
export type Department = Tables<"department">;
export type Session = Tables<"session">;
export type Stress = Tables<"stress">;
export type Rating = Tables<"rating">;

export type NewUser = TablesInsert<"user">;
export type NewRole = TablesInsert<"role">;
export type NewDepartment = TablesInsert<"department">;
export type NewSession = TablesInsert<"session">;
export type NewStress = TablesInsert<"stress">;
export type NewRating = TablesInsert<"rating">;

export type UpdateUser = TablesUpdate<"user">;
export type UpdateRole = TablesUpdate<"role">;
export type UpdateDepartment = TablesUpdate<"department">;
export type UpdateSession = TablesUpdate<"session">;
export type UpdateStress = TablesUpdate<"stress">;
export type UpdateRating = TablesUpdate<"rating">;
