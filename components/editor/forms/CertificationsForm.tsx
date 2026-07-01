'use client';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Sparkles, AlertTriangle } from 'lucide-react';
import { useAIAction } from '@/hooks/useAIAction';
import { isValidUrl } from '@/lib/resumeUtils';
import { useUIStore } from '@/store/uiStore';

export function CertificationsForm() {
  const certifications = useResumeStore((s) => s.resume.certifications);
  const resume = useResumeStore((s) => s.resume);
  const { addCertification, removeCertification, updateCertification } = useResumeStore();
  const validationErrors = useResumeStore((s) => s.validationErrors) ?? {};
  const setValidationError = useResumeStore((s) => s.setValidationError);
  const showToast = useUIStore((s) => s.showToast);

  const { trigger, isLoading } = useAIAction();

  const handleSuggestCertifications = () => {
    const primaryRole = resume.experience[0]?.role || 'Software Engineer';
    const skillsList = resume.skills?.join(', ') || '';
    const contextStr = `Role: ${primaryRole}, Skills: ${skillsList}`;

    trigger('suggest_certifications', contextStr, 'Suggest Certifications', (text) => {
      if (!text) return;
      const certNames = text
        .split(/,|\n/)
        .map((c) => c.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);

      if (certNames.length > 0) {
        const resumeStore = useResumeStore.getState();
        const currentCerts = resumeStore.resume.certifications ?? [];
        const newCerts = certNames.map(name => ({
          id: crypto.randomUUID(),
          name,
          issuer: 'Suggested Organization',
          date: new Date().getFullYear().toString(),
        }));
        resumeStore.updateSection('certifications', [...currentCerts, ...newCerts]);
        showToast(`Added ${newCerts.length} suggested certifications to your resume!`, 'success');
      } else {
        showToast('No new certifications found in suggestions', 'info');
      }
    });
  };

  const handleValidateUrl = (id: string, value: string) => {
    if (value && !isValidUrl(value)) {
      setValidationError(`cert-${id}`, 'Must be a valid credential website URL');
    } else {
      setValidationError(`cert-${id}`, null);
    }
  };

  const handleRemove = (id: string) => {
    setValidationError(`cert-${id}`, null);
    removeCertification(id);
  };

  // Helper to check if certificate is older than 3 years (assuming current year is 2026)
  const isPossiblyExpired = (dateStr: string) => {
    if (!dateStr) return false;
    const match = dateStr.match(/\b(20\d{2})\b/);
    if (match) {
      const year = parseInt(match[1], 10);
      return year <= 2023; // AWS/Cisco/etc expire in 3 years. Since now is 2026, <=2023 is expired.
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {certifications.map((cert) => {
        const expired = isPossiblyExpired(cert.date);

        return (
          <div key={cert.id} className="border border-border rounded-[10px] p-5 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">Certification</p>
              <button
                onClick={() => handleRemove(cert.id)}
                className="text-danger hover:opacity-70 transition-opacity p-1.5 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Certificate Name"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                placeholder="e.g. AWS Cloud Practitioner"
                className="sm:col-span-2"
              />
              <Input
                label="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                placeholder="e.g. Amazon Web Services"
              />
              <div className="flex flex-col gap-1">
                <Input
                  label="Date Earned"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                  placeholder="e.g. March 2024"
                />
                {expired && (
                  <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    May be expired (over 3 years old)
                  </p>
                )}
              </div>
              <Input
                label="Credential URL"
                value={cert.credentialUrl ?? ''}
                error={validationErrors[`cert-${cert.id}`]}
                onChange={(e) => {
                  const val = e.target.value;
                  updateCertification(cert.id, { credentialUrl: val });
                  handleValidateUrl(cert.id, val);
                }}
                placeholder="e.g. https://verify.aws..."
                className="sm:col-span-2"
              />
            </div>
          </div>
        );
      })}

      <div className="flex gap-3">
  <Button
    size="md"
    onClick={handleSuggestCertifications}
    loading={isLoading}
    className="flex-1 flex items-center justify-center gap-2
      bg-gradient-to-r from-violet-600 to-indigo-600
      hover:from-violet-700 hover:to-indigo-700
      text-white font-semibold rounded-lg
      shadow-md hover:shadow-lg
      border border-violet-700
      transition-all duration-200"
  >
    <Sparkles className="h-4 w-4" />
    AI Suggest Certifications
  </Button>

  <Button
    variant="primary"
    size="md"
    onClick={addCertification}
    className="flex-1 flex items-center justify-center gap-2
      bg-gradient-to-r from-green-400 to-green-600
      hover:from-green-700 hover:to-green-700
      text-white font-semibold rounded-lg
      shadow-md hover:shadow-lg
      border border-green-500
      transition-all duration-200"
  >
    <Plus className="h-4 w-4 mr-2" />
    Add Certification
  </Button>
</div>
    </div>
  );
}
