"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearPublishState } from "@/store/createProblemSlice";

export const useCreateProblemNotifications = () => {
  const dispatch = useDispatch();
  const { publishSuccess, publishError } = useSelector(
    (state) => state.createProblem
  );

  useEffect(() => {
    if (publishSuccess) {
      console.log("Problem published successfully!");
      // TODO: Replace with toast notification
      // TODO: Navigate to problem list or show success message

      // Clear success state after handling
      const timer = setTimeout(() => {
        dispatch(clearPublishState());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [publishSuccess, dispatch]);

  useEffect(() => {
    if (publishError) {
      console.error("Failed to publish problem:", publishError);
      // TODO: Replace with error toast notification

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
