
import { Suspense } from "react";
import TaskPickerContent from "@/src/components/TaskPicker/taskPickerContext";
import ForestScene from "@/src/components/Home/forestScene";

const TaskPickerPage = () => {
  return (
    <Suspense fallback={null}>
      <div className="wonderland">
        <ForestScene />
        <TaskPickerContent />
      </div>
    </Suspense>
  );
};

export default TaskPickerPage;
