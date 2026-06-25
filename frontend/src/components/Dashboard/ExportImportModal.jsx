import { useState } from 'react';
import { exportTasks, exportTasksCSV, importTasks } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ExportImportModal = ({ isOpen, onClose, onRefresh }) => {
  const { token } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const data = await exportTasks(token);
      
      // Create download
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Exported ${data.count} tasks! ✨`);
    } catch (error) {
      toast.error('Failed to export tasks');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const blob = await exportTasksCSV(token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Exported as CSV! ✨');
    } catch (error) {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Check if it's a valid export
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid file format. Expected tasks array.');
      }

      const result = await importTasks(token, data.data);
      toast.success(result.message || 'Tasks imported successfully! 🎉');
      onRefresh();
      onClose();
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON file');
      } else {
        toast.error(error.message || 'Failed to import tasks');
      }
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 w-full max-w-md"
        style={{ borderColor: '#131214' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-4 border-b-2 flex items-center justify-between"
          style={{ borderColor: '#131214' }}
        >
          <h3 className="text-lg font-bold" style={{ color: '#131214' }}>
            📤 Export / Import Tasks
          </h3>
          <button
            onClick={onClose}
            className="text-xl font-mono hover:opacity-100 transition"
            style={{ color: '#131214', opacity: 0.4 }}
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Export Section */}
          <div>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#131214' }}>
              📤 Export
            </h4>
            <div className="flex gap-3">
              <button
                onClick={handleExportJSON}
                disabled={isExporting}
                className="flex-1 px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5 disabled:opacity-50"
                style={{ borderColor: '#131214', backgroundColor: '#B6CAEC' }}
              >
                {isExporting ? '⏳ Exporting...' : '📄 JSON'}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex-1 px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5 disabled:opacity-50"
                style={{ borderColor: '#131214', backgroundColor: '#C9E4C5' }}
              >
                {isExporting ? '⏳ Exporting...' : '📊 CSV'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2" style={{ borderColor: '#E5E5E5' }} />

          {/* Import Section */}
          <div>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#131214' }}>
              📥 Import
            </h4>
            <label
              className="block w-full px-4 py-3 border-2 text-center cursor-pointer transition-all hover:translate-x-0.5"
              style={{ 
                borderColor: '#131214', 
                backgroundColor: '#FAF4E3',
                borderStyle: 'dashed'
              }}
            >
              {isImporting ? '⏳ Importing...' : '📁 Choose JSON file'}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
              />
            </label>
            <p className="text-xs mt-2" style={{ color: '#131214', opacity: 0.5 }}>
              Import a JSON file exported from this app
            </p>
          </div>
        </div>

        <div
          className="p-4 border-t-2 flex justify-end"
          style={{ borderColor: '#131214' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 transition-all hover:translate-x-0.5"
            style={{ borderColor: '#131214', backgroundColor: '#FAF4E3' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportImportModal;