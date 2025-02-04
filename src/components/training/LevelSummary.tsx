"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

interface LevelSummaryProps {
  stats: {
    totalResponses: number;
    averageScore: number;
    bestResponse: string;
    areasToImprove: string[];
    usedPhrases: string[];
    missedOpportunities: string[];
  };
  onContinue: () => void;
}

export function LevelSummary({ stats, onContinue }: LevelSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-b from-blue-900 to-blue-950 p-6 rounded-lg max-w-2xl w-full"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Level Complete!</h2>
        
        <div className="space-y-6">
          {/* Performance Stats */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-900/30 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-blue-200 mb-2">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-300">Average Score</p>
                <p className="text-xl font-bold text-yellow-400">{stats.averageScore}</p>
              </div>
              <div>
                <p className="text-sm text-blue-300">Total Responses</p>
                <p className="text-xl font-bold text-blue-200">{stats.totalResponses}</p>
              </div>
            </div>
          </motion.div>

          {/* Best Response */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-green-900/20 p-4 rounded-lg border border-green-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-400 w-5 h-5" />
              <h3 className="text-lg font-semibold text-green-200">Best Response</h3>
            </div>
            <p className="text-green-100">{stats.bestResponse}</p>
          </motion.div>

          {/* Areas to Improve */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-orange-900/20 p-4 rounded-lg border border-orange-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-orange-400 w-5 h-5" />
              <h3 className="text-lg font-semibold text-orange-200">Opportunities</h3>
            </div>
            <ul className="list-disc list-inside space-y-2">
              {stats.missedOpportunities.map((phrase, index) => (
                <li key={index} className="text-orange-100">
                  Try incorporating: "{phrase}"
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <Button
          onClick={onContinue}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
        >
          Continue to Next Level
        </Button>
      </motion.div>
    </motion.div>
  );
} 