'use client';

import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

interface FileDownloadProps {
  onDownload: (ports: number[]) => Promise<void>;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
  const [inviteCodes, setInviteCodes] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Split codes by comma, space, or newline
    const codes = inviteCodes.split(/[,\s]+/).map(code => code.trim()).filter(Boolean);
    const ports = codes.map(code => parseInt(code, 10)).filter(port => !isNaN(port) && port > 0 && port <= 65535);
    if (ports.length === 0) {
      setError('Please enter at least one valid port number (1-65535)');
      return;
    }
    try {
      await onDownload(ports);
    } catch (err) {
      setError('Failed to download one or more files. Please check the invite codes and try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Receive Files</h3>
        <p className="text-sm text-blue-600 mb-0">
          Enter one or more invite codes (comma, space, or newline separated) to download files.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inviteCodes" className="block text-sm font-medium text-gray-700 mb-1">
            Invite Codes
          </label>
          <textarea
            id="inviteCodes"
            value={inviteCodes}
            onChange={(e) => setInviteCodes(e.target.value)}
            placeholder="Enter invite codes (port numbers)"
            className="input-field w-full min-h-[60px]"
            disabled={isDownloading}
            required
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          className="btn-primary flex items-center justify-center w-full"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <span>Downloading...</span>
          ) : (
            <>
              <FiDownload className="mr-2" />
              <span>Download Files</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
