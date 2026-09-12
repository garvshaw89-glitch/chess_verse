import React from 'react';
import { useLearnStore } from '../store/learnStore';
import { NavPage } from '../components/ui/Navbar';
import { LearningDashboard } from '../components/learn/LearningDashboard';
import { LessonPlayer } from '../components/learn/LessonPlayer';
import { CourseMapModal } from '../components/learn/CourseMapModal';
import { AchievementsModal } from '../components/learn/AchievementsModal';
import { CourseCompletionModal } from '../components/learn/CourseCompletionModal';

interface LearnViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const LearnView: React.FC<LearnViewProps> = () => {
  const { activeLessonId } = useLearnStore();

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] bg-neutral-950 text-neutral-100 flex flex-col">
      {activeLessonId ? (
        <LessonPlayer />
      ) : (
        <LearningDashboard />
      )}

      {/* Interactive Curriculum Modals */}
      <CourseMapModal />
      <AchievementsModal />
      <CourseCompletionModal />
    </div>
  );
};
