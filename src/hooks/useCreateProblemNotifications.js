"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearPublishState } from "@/store/createProblemSlice";
import toast from "react-hot-toast";

export const useCreateProblemNotifications = () => {
  const dispatch = useDispatch();
  const { publishSuccess, publishError } = useSelector(
    (state) => state.createProblem
  );

  useEffect(() => {
    if (publishSuccess) {
      toast.success("Problem published successfully!", {
        duration: 4000,
        position: "top-right",
      });

      // Clear success state after handling
      const timer = setTimeout(() => {
        dispatch(clearPublishState());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [publishSuccess, dispatch]);

  useEffect(() => {
    if (publishError) {
      toast.error(`Failed to publish problem: ${publishError}`, {
        duration: 6000,
        position: "top-right",
      });

      // Clear error state after showing
      const timer = setTimeout(() => {
        dispatch(clearPublishState());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [publishError, dispatch]);

  return {
    publishSuccess,
    publishError,
  };
};
