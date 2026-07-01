'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Edit, GraduationCap, Award, Sparkles, Download } from 'lucide-react';

interface Activity {
  id: string;
  action: string;
  meta: any;
  createdAt: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (data && data.activities) {
          setActivities(data.activities);
        }
      });
  }, []);

  const getActivityConfig = (action: string, meta: any) => {
    switch (action) {
      case 'resume_created':
        return {
          icon: Sparkles,
          iconBg: 'bg-emerald-50',
          iconColor: 'text-success',
          title: 'Resume created',
          description: 'Started a new resume template profile.',
        };
      case 'resume_updated':
        return {
          icon: Edit,
          iconBg: 'bg-blue-50',
          iconColor: 'text-primary-DEFAULT',
          title: 'Resume details updated',
          description: 'Modified profile segments in the editor.',
        };
      case 'ats_run':
        return {
          icon: TrendingUp,
          iconBg: 'bg-cyan-50',
          iconColor: 'text-accent-cyan',
          title: `ATS check run: ${meta?.score ?? 0}%`,
          description: `Audited resume match against job specifications.`,
        };
      case 'download':
        return {
          icon: Download,
          iconBg: 'bg-amber-50',
          iconColor: 'text-warning',
          title: 'Resume PDF downloaded',
          description: 'Exported a fresh copy of your resume.',
        };
      default:
        return {
          icon: Sparkles,
          iconBg: 'bg-purple-50',
          iconColor: 'text-purple-600',
          title: 'Activity logged',
          description: 'Performed action in workspace.',
        };
    }
  };

  return (
    <div className="bg-white rounded-[10px] border border-border shadow-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
      </div>
      <div className="relative">
        {activities.length > 0 && (
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
        )}
        <div className="space-y-5">
          {activities.map((item) => {
            const config = getActivityConfig(item.action, item.meta);
            const Icon = config.icon;
            const timeAgo = new Date(item.createdAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={item.id} className="relative flex items-start gap-4 pl-1 animate-in fade-in slide-in-from-bottom-2">
                <div className={`relative z-10 w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${config.iconColor}`} />
                </div>
                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-text-primary leading-snug">{config.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{config.description} • {timeAgo}</p>
                </div>
              </div>
            );
          })}
          {activities.length === 0 && (
            <div className="text-center py-6 text-xs text-text-muted italic">
              No recent activity logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
