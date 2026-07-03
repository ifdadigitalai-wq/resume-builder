'use client';

import { useState, useEffect } from 'react';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PrimaryActions } from '@/components/dashboard/PrimaryActions';
import { Clock, Target } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function DashboardPage() {
  const [userName, setUserName] = useState('Student');
  const [stats, setStats] = useState({
    resumeCount: 0,
    latestAtsScore: 0,
    downloadCount: 0,
    completionScore: 0,
  });

  useEffect(() => {
    // Fetch User
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserName(data.user.name);
        }
      });

    // Fetch Stats
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStats({
            resumeCount: data.resumeCount ?? 0,
            latestAtsScore: data.latestAtsScore ?? 0,
            downloadCount: data.downloadCount ?? 0,
            completionScore: data.completionScore ?? 0,
          });
        }
      });
  }, []);

  const deriveReadiness = (ats: number, completion: number, resumeCount: number) => {
    if (resumeCount > 0 && ats >= 80 && completion >= 90) return 'Ready';
    if (resumeCount > 0 && completion >= 50) return 'Getting There';
    return 'Not Started';
  };

  const readiness = deriveReadiness(stats.latestAtsScore, stats.completionScore, stats.resumeCount);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6"
    >
      {/* Hero Section */}
      <motion.section
        variants={fadeUp}
        whileHover={{ scale: 1.01 }}
        className="relative isolate overflow-hidden rounded-[12px] border border-[#BFD7FF] bg-[#EAF3FF] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_42px_rgba(59,73,223,0.12)]"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="absolute right-5 top-5 h-28 w-28 rounded-full bg-primary-DEFAULT/15 blur-2xl"
        />

        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary-DEFAULT to-accent-cyan" />
        <div className="absolute bottom-0 right-0 h-20 w-64 bg-gradient-to-l from-cyan-200/35 to-transparent blur-xl" />

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative text-2xl font-extrabold tracking-[-0.03em] text-[#10233F]"
        >
          Welcome back, {userName}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="relative mt-1 text-sm font-medium text-[#45607F]"
        >
          {stats.resumeCount > 0 
            ? `You have ${stats.resumeCount} resume${stats.resumeCount > 1 ? 's' : ''}. Open one to track completion!`
            : "Create or upload a resume to start building your placement profile!"}
        </motion.p>
      </motion.section>

      {/* Metrics */}
      <motion.section
        variants={fadeUp}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          <MetricCard
            key="1"
            title="Total Resumes"
            value={stats.resumeCount}
            type="text"
            badgeVariant="blue"
            icon={<Clock className="h-5 w-5 text-blue-600" />}
            subtitle="Resumes created"
          />,
          <MetricCard
            key="2"
            title="ATS Score"
            value={stats.latestAtsScore}
            type="ring"
            color="#06B6D4"
            subtitle={stats.latestAtsScore >= 80 ? "Excellent match" : stats.latestAtsScore >= 50 ? "Good match" : "Need improvements"}
          />,
          <MetricCard
            key="3"
            title="Placement Readiness"
            value={readiness}
            type="badge"
            badgeVariant={readiness === 'Ready' ? 'green' : readiness === 'Getting There' ? 'amber' : 'gray'}
            icon={<Target className="h-5 w-5 text-warning" />}
            subtitle={readiness === 'Ready' ? 'Profile stands out' : 'Pending profile updates'}
          />,
          <MetricCard
            key="4"
            title="Downloads"
            value={stats.downloadCount}
            type="text"
            badgeVariant="gray"
            icon={<Clock className="h-5 w-5 text-text-muted" />}
            subtitle="Total PDF downloads"
          />,
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + index * 0.1,
              duration: 0.5,
            }}
            whileHover={{
              y: -5,
              transition: { duration: 0.2 },
            }}
          >
            {card}
          </motion.div>
        ))}
      </motion.section>

      {/* Actions */}
      <motion.div variants={fadeUp}>
        <PrimaryActions />
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        variants={fadeUp}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <ActivityFeed />
      </motion.div>
    </motion.div>
  );
}