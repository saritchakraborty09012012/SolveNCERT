import React from 'react';
import { Download, Printer, FileText, X } from 'lucide-react';
import { usePracticeStore } from '@/store/practiceStore';
import jsPDF from 'jspdf';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportPanel({ isOpen, onClose }: ExportPanelProps) {
  const { currentPaper, resultAnalytics } = usePracticeStore();

  if (!isOpen || !currentPaper) return null;

  const handlePrint = () => {
    document.body.classList.add('print-paper');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-paper');
    }, 500);
  };

  const generatePDF = (type: 'paper' | 'answers' | 'solutions') => {
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;
    const pageWidth = 510;
    const marginLeft = 48;

    const addLine = (text: string, fontSize = 11, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, pageWidth);
      lines.forEach((line: string) => {
        if (y > 790) {
          pdf.addPage();
          y = 48;
        }
        pdf.text(line, marginLeft, y);
        y += 16;
      });
    };

    const addSpacer = (space = 8) => {
      y += space;
      if (y > 790) {
        pdf.addPage();
        y = 48;
      }
    };

    // Title
    addLine('Solvencert Practice Paper', 18, true);
    addSpacer(4);
    addLine(`Subject: ${currentPaper.subject} | Chapter: ${currentPaper.chapter}`, 12, false, [80, 80, 80]);
    addLine(`Difficulty: ${currentPaper.difficulty}`, 12, false, [80, 80, 80]);
    addSpacer(12);

    if (type === 'paper') {
      currentPaper.questions.forEach((q, index) => {
        addLine(`${index + 1}. ${q.text}`, 11, true);
        if (q.options && q.options.length > 0) {
          q.options.forEach((opt, optIndex) => {
            const label = String.fromCharCode(65 + optIndex);
            addLine(`   ${label}) ${opt}`, 10, false, [60, 60, 60]);
          });
        }
        addSpacer(6);
      });
    } else if (type === 'answers') {
      addLine('Answer Key', 14, true);
      addSpacer(6);
      currentPaper.questions.forEach((q, index) => {
        if (y > 790) {
          pdf.addPage();
          y = 48;
        }
        addLine(`${index + 1}. ${q.text}`, 11, true);
        addLine(`   Answer: ${q.correctAnswer || 'N/A'}`, 10, false, [0, 100, 0]);
        addSpacer(4);
      });
    } else if (type === 'solutions') {
      addLine('Detailed Solutions', 14, true);
      addSpacer(6);
      currentPaper.questions.forEach((q, index) => {
        addLine(`${index + 1}. ${q.text}`, 11, true);
        addLine(`   Answer: ${q.correctAnswer || 'N/A'}`, 10, false, [0, 100, 0]);
        if (q.explanation) {
          addLine(`   Explanation: ${q.explanation}`, 10, false, [60, 60, 60]);
        }
        if (q.revisionTip) {
          addLine(`   Revision Tip: ${q.revisionTip}`, 10, false, [80, 80, 160]);
        }
        addSpacer(6);
      });

      if (resultAnalytics) {
        addSpacer(12);
        addLine('Your Performance Summary', 14, true);
        addSpacer(4);
        addLine(`Score: ${resultAnalytics.score}/${resultAnalytics.total_questions}`, 11, false, [0, 0, 0]);
        addLine(`Accuracy: ${resultAnalytics.accuracy}%`, 11, false, [0, 0, 0]);
        addLine(`Time Taken: ${resultAnalytics.time_taken_sec} minutes`, 11, false, [0, 0, 0]);
        if (resultAnalytics.weaknesses && resultAnalytics.weaknesses.length > 0) {
          addLine(`Weak Areas: ${resultAnalytics.weaknesses.join(', ')}`, 11, false, [160, 80, 0]);
        }
      }
    }

    const filename = `solvencert-${currentPaper.subject.toLowerCase().replace(/\s+/g, '-')}-${currentPaper.chapter.toLowerCase().replace(/\s+/g, '-')}-${type}.pdf`;
    pdf.save(filename);
  };

  const options = [
    {
      id: 'print',
      icon: Printer,
      title: 'Print Paper',
      description: 'Print the practice paper directly from your browser',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#60a5fa',
      action: handlePrint,
    },
    {
      id: 'paper',
      icon: FileText,
      title: 'Download Paper (PDF)',
      description: 'Save the question paper as a PDF file without answers',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#34d399',
      action: () => generatePDF('paper'),
    },
    {
      id: 'answers',
      icon: FileText,
      title: 'Download Answer Key (PDF)',
      description: 'Save all correct answers in a clean PDF format',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      iconColor: '#fbbf24',
      action: () => generatePDF('answers'),
    },
    {
      id: 'solutions',
      icon: Download,
      title: 'Download Detailed Solutions (PDF)',
      description: 'Save complete solutions with explanations and revision tips',
      iconBg: 'rgba(168, 85, 247, 0.15)',
      iconColor: '#c084fc',
      action: () => generatePDF('solutions'),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden border"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(235, 170, 45, 0.15)' }}>
              <Download className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Export Practice Paper</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose your preferred format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={option.action}
                className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 active:scale-[0.98]"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <div className="p-3 rounded-lg" style={{ background: option.iconBg }}>
                  <Icon className="w-5 h-5" style={{ color: option.iconColor }} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{option.title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-medium rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}