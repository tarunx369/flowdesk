import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import AddTaskModal from "./AddTaskModal.jsx";

export default function FloatingAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Add task"
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-violet text-white shadow-glow md:hidden"
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
      <AddTaskModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
