"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { trainingConfig } from "@/config/training-config";
import { Play } from "lucide-react";

export function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextStep = () => {
    if (currentStep < trainingConfig.tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
      >
        <Play className="w-4 h-4" />
        Watch Tutorial
      </Button>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {trainingConfig.tutorial.steps[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            {trainingConfig.tutorial.steps[currentStep].content}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {trainingConfig.tutorial.steps[currentStep].videoUrl ? (
            <video
              src={trainingConfig.tutorial.steps[currentStep].videoUrl}
              controls
              className="w-full rounded-lg aspect-video bg-black/10"
              poster={trainingConfig.tutorial.steps[currentStep].thumbnail}
            >
              <source 
                src={trainingConfig.tutorial.steps[currentStep].videoUrl} 
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full aspect-video bg-black/10 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-500">Video coming soon</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button onClick={nextStep}>
            {currentStep === trainingConfig.tutorial.steps.length - 1
              ? "Finish"
              : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 