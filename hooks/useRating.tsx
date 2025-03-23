"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRatingAction,
  deleteRatingAction,
  getAllRatingsAction,
  getRatingAction,
  getRatingsForDepartmentAction,
  updateRatingAction,
} from "@/actions/ratingAction";
import {
  NewRating,
  Rating,
  UpdateRating,
} from "@/supabase/types/database.models";

export const useGetRating = ({ rating_id }: { rating_id: string }) => {
  return useQuery({
    queryKey: ["getRating", rating_id],
    queryFn: async () => {
      const rating: Rating = await getRatingAction({ rating_id });
      return rating;
    },
    enabled: !!rating_id, // Nur ausführen, wenn `rating_id` vorhanden ist
  });
};

export const useGetAllRatings = () => {
  return useQuery({
    queryKey: ["getAllRatings"],
    queryFn: async () => {
      const ratings = await getAllRatingsAction();
      return ratings;
    },
  });
};

export const useGetRatingsForDepartment = ({
  department_id,
}: {
  department_id: string;
}) => {
  return useQuery({
    queryKey: ["getRatingsForDepartment", department_id],
    queryFn: async () => {
      const ratings: Rating[] = await getRatingsForDepartmentAction({
        department_id,
      });
      return ratings;
    },
    enabled: !!department_id,
  });
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRating: NewRating) => {
      return await createRatingAction(newRating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllRatings"] }); // Aktualisiert den Cache
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rating_id,
      updates,
    }: {
      rating_id: string;
      updates: UpdateRating;
    }) => {
      return await updateRatingAction(rating_id, updates);
    },
    onSuccess: (_, { rating_id }) => {
      queryClient.invalidateQueries({ queryKey: ["getRating", rating_id] }); // Aktualisiert nur diese Bewertung
    },
  });
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rating_id: string) => {
      return await deleteRatingAction(rating_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllRatings"] }); // Cache für alle Bewertungen löschen
    },
  });
};
