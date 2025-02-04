"use client";

import { Button } from "@/components/ui/button";
import { Trophy, Star, ArrowRight } from "lucide-react";
import { Level } from "@/config/levels";
import { motion, AnimatePresence } from "framer-motion";

interface LevelCompleteProps {
  level: Level;
  score: number;
  newBadges: string[];
  onContinue: () => void;
}

export function LevelComplete({ level, score, newBadges, onContinue }: LevelCompleteProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      >
        <motion.div 
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25 
          }}
          className="bg-gradient-to-b from-blue-900 to-blue-950 p-8 rounded-lg max-w-md w-full mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Level {level.id} Complete!
            </motion.h2>
            <p className="text-blue-200 mb-6">{level.description}</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Final Score</span>
                <span className="text-yellow-400 font-bold">{score}</span>
              </div>
            </div>

            {newBadges.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 my-4"
              >
                <h3 className="text-blue-200">New Badges Earned:</h3>
                <div className="flex gap-2 flex-wrap justify-center">
                  {newBadges.map((badge, index) => (
                    <motion.div
                      key={badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      {badge}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={onContinue}
                className="bg-orange-500 hover:bg-orange-600 w-full mt-4"
              >
                Continue to Next Level
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 