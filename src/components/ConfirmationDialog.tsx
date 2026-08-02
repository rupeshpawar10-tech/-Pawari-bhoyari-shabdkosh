import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  itemTypeLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title = "Confirm Delete (हटाने की पुष्टि करें)",
  message = "क्या आप सचमुच इस रिकॉर्ड को हटाना चाहते हैं? यह कार्रवाई वापस नहीं ली जा सकती।\n(Are you sure you want to delete this item? This action cannot be undone.)",
  itemName,
  itemTypeLabel,
  confirmLabel = "हां, मिटाएं (Delete)",
  cancelLabel = "रद्द करें (Cancel)",
  onConfirm,
  onCancel,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard accessibility (Escape to cancel, Enter to confirm)
  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button by default for safety
    setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-200"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div 
        className="bg-white border border-stone-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0 shadow-2xs border border-rose-200">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-rose-200/70 text-rose-900 font-bold text-[10px] rounded-full uppercase tracking-wide">
                  {itemTypeLabel ? itemTypeLabel : 'प्रशासनिक कार्रवाई'}
                </span>
              </div>
              <h3 id="confirm-dialog-title" className="font-serif font-bold text-stone-900 text-base sm:text-lg mt-0.5 leading-snug">
                {title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={onCancel}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-rose-100/50 rounded-lg transition cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-stone-700">
          {itemName && (
            <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-2 font-bold text-stone-900 text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">"{itemName}"</span>
            </div>
          )}

          <p className="leading-relaxed whitespace-pre-line text-stone-700 font-medium">
            {message}
          </p>

          <p className="text-[11px] text-stone-500 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
            💡 नोट: यह रिकॉर्ड सुरक्षित रखने हेतु एडमिन "रीसायकल बिन (Recycle Bin)" में संग्रहीत किया जाएगा, जहाँ से आवश्यकता होने पर इसे पुनः पुनर्स्थापित (Restore) किया जा सकता है।
          </p>
        </div>

        {/* Action Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="px-4 sm:px-5 py-2.5 bg-white hover:bg-stone-100 text-stone-700 font-bold rounded-xl border border-stone-300 shadow-2xs transition cursor-pointer text-xs sm:text-sm"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 sm:px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm border border-rose-800"
          >
            <Trash2 className="w-4 h-4" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
