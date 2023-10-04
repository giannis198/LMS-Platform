"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { Trash } from "lucide-react";
import { ConfirmModal } from "../modals/ConfirmModal";
import toast from "react-hot-toast";
import axios from "axios";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${id}`);
      toast.success("Chapter deleted");
      router.push(`/teacher/courses/${courseId}`);
      router.refresh()
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => {}}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={() => onDelete(chapterId)}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
