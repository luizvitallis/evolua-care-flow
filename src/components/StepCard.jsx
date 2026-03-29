import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const CARD_COLORS = [
  "linear-gradient(135deg, #0984e3, #74b9ff)",
  "linear-gradient(135deg, #00b894, #55efc4)",
  "linear-gradient(135deg, #6c5ce7, #a29bfe)",
  "linear-gradient(135deg, #e84393, #fd79a8)",
  "linear-gradient(135deg, #fdcb6e, #f39c12)",
  "linear-gradient(135deg, #00cec9, #81ecec)",
];

export default function StepCard({ icon: Icon, image, title, description, onClick, delay = 0, colorIndex = 0 }) {
  const bgGradient = CARD_COLORS[colorIndex % CARD_COLORS.length];

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full text-left"
    >
      <div
        className="flex items-center gap-4 p-4 rounded-2xl text-white shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/15 transition-shadow duration-200"
        style={{ background: bgGradient }}
      >
        {image ? (
          <img src={image} alt={title} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/20" />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm leading-tight">{title}</p>
          {description && (
            <p className="text-[12px] text-white/75 mt-0.5 truncate">{description}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 shrink-0" />
      </div>
    </motion.button>
  );
}