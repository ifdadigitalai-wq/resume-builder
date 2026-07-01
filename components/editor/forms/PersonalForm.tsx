'use client';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizePhone } from '@/lib/resumeUtils';
import { useAIAction } from '@/hooks/useAIAction';
import { Sparkles } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export function PersonalForm() {
  const personal = useResumeStore((s) => s.resume.personal) ?? { fullName: '', email: '', phone: '', location: '' };
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const validationErrors = useResumeStore((s) => s.validationErrors) ?? {};
  const setValidationError = useResumeStore((s) => s.setValidationError);
  const showToast = useUIStore((s) => s.showToast);

  const { trigger, isLoading } = useAIAction();

  const handleSuggestTitle = () => {
    const contextStr = `Name: ${personal.fullName || 'Student'}, Location: ${personal.location || 'India'}`;
    trigger('suggest_title', contextStr, 'Suggest Title', (text) => {
      if (!text) return;
      const titles = text.split('|').map(t => t.trim()).filter(Boolean);
      const chosen = titles[0] || text;
      useResumeStore.setState((s) => {
        s.resume.title = chosen;
        s.isDirty = true;
      });
      showToast(`Updated resume title to: ${chosen}`, 'success');
    });
  };

  const validateField = (name: string, value: string) => {
    if (name === 'email') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setValidationError('email', 'Invalid email format (e.g. name@domain.com)');
      } else {
        setValidationError('email', null);
      }
    } else if (name === 'phone') {
      if (value && !/^\+?[0-9\s\-()]{10,20}$/.test(value)) {
        setValidationError('phone', 'Phone must be a valid number of 10-20 digits');
      } else {
        setValidationError('phone', null);
      }
    } else if (name === 'linkedIn') {
      if (value && !value.includes('linkedin.com')) {
        setValidationError('linkedIn', 'Must be a valid LinkedIn profile URL');
      } else {
        setValidationError('linkedIn', null);
      }
    } else if (name === 'github') {
      if (value && !value.includes('github.com')) {
        setValidationError('github', 'Must be a valid GitHub profile URL');
      } else {
        setValidationError('github', null);
      }
    } else if (name === 'portfolio') {
      if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})/i.test(value)) {
        setValidationError('portfolio', 'Must be a valid website URL');
      } else {
        setValidationError('portfolio', null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={personal.fullName}
          onChange={(e) => updatePersonal({ fullName: e.target.value })}
          placeholder="Arjun Sharma"
        />
        <Input
          label="Email Address"
          type="email"
          value={personal.email}
          error={validationErrors.email}
          onChange={(e) => {
            const val = e.target.value;
            updatePersonal({ email: val });
            validateField('email', val);
          }}
          placeholder="arjun@iitd.ac.in"
        />
        <Input
          label="Phone Number"
          value={personal.phone}
          error={validationErrors.phone}
          onChange={(e) => {
            const val = e.target.value;
            updatePersonal({ phone: val });
            validateField('phone', val);
          }}
          onBlur={(e) => {
            const val = e.target.value;
            const normalized = normalizePhone(val);
            updatePersonal({ phone: normalized });
          }}
          placeholder="+91 98765 43210"
        />
        <Input
          label="Location (City, Country)"
          value={personal.location}
          onChange={(e) => updatePersonal({ location: e.target.value })}
          placeholder="New Delhi, India"
        />
        <Input
          label="LinkedIn Profile URL"
          value={personal.socials?.linkedIn ?? (personal as any).linkedIn ?? ''}
          error={validationErrors.linkedIn}
          onChange={(e) => {
            const val = e.target.value;
            updatePersonal({ socials: { ...personal.socials, linkedIn: val } });
            validateField('linkedIn', val);
          }}
          placeholder="linkedin.com/in/arjunsharma"
        />
        <Input
          label="GitHub Profile URL"
          value={personal.socials?.github ?? (personal as any).github ?? ''}
          error={validationErrors.github}
          onChange={(e) => {
            const val = e.target.value;
            updatePersonal({ socials: { ...personal.socials, github: val } });
            validateField('github', val);
          }}
          placeholder="github.com/arjunsharma"
        />
        <Input
          label="Portfolio Website URL"
          value={personal.socials?.portfolio ?? (personal as any).portfolio ?? ''}
          error={validationErrors.portfolio}
          onChange={(e) => {
            const val = e.target.value;
            updatePersonal({ socials: { ...personal.socials, portfolio: val } });
            validateField('portfolio', val);
          }}
          placeholder="arjunsharma.dev"
          className="sm:col-span-2"
        />
      </div>

      <div className="border-t border-slate-100 pt-4 flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSuggestTitle}
          loading={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Suggest Target Headline / Title
        </Button>
      </div>
    </div>
  );
}
