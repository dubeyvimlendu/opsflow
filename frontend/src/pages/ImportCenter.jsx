import { useRef, useState } from 'react';
import { importEmployees } from '../api/employees';
import { ApiError, formatErrorDetail } from '../api/client';

const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.json'];

function getExtension(filename) {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Fields shown here are exactly what process_employee_import returns —
// nothing added, nothing assumed.
const RESULT_FIELDS = [
  { key: 'total_records', label: 'Total records' },
  { key: 'valid_records', label: 'Valid records' },
  { key: 'invalid_records', label: 'Invalid records' },
  { key: 'inserted_records', label: 'Inserted' },
  { key: 'duplicate_records', label: 'Duplicates' },
];

export default function ImportCenter() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [result, setResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  function selectFile(candidate) {
    setResult(null);
    setUploadError(null);
    setStatus('idle');

    if (!candidate) {
      setFile(null);
      return;
    }

    const ext = getExtension(candidate.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setFile(null);
      setFileError(`Unsupported file type "${ext || 'unknown'}". Use CSV, XLSX, or JSON.`);
      return;
    }

    setFileError(null);
    setFile(candidate);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    selectFile(dropped);
  }

  async function handleProcess() {
    if (!file) return;
    setStatus('uploading');
    setUploadError(null);

    try {
      const data = await importEmployees(file);
      setResult(data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setUploadError(
        err instanceof ApiError
          ? formatErrorDetail(err.detail) || err.message
          : 'Could not reach the OpsFlow backend.'
      );
    }
  }

  function reset() {
    setFile(null);
    setFileError(null);
    setResult(null);
    setUploadError(null);
    setStatus('idle');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="import-center">
      <p className="import-center__intro">
        Upload a CSV, XLSX, or JSON file to run it through the OpsFlow import
        pipeline: clean, validate, and insert.
      </p>

      {status !== 'success' && (
        <>
          <div
            className={'dropzone' + (isDragging ? ' dropzone--active' : '')}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(',')}
              hidden
              onChange={(e) => selectFile(e.target.files?.[0])}
            />
            <p className="dropzone__title">Drag a file here, or click to browse</p>
            <p className="dropzone__hint">Accepted formats: CSV, XLSX, JSON</p>
          </div>

          {fileError && <div className="import-center__banner">{fileError}</div>}

          {file && !fileError && (
            <div className="file-preview">
              <div>
                <div className="file-preview__name">{file.name}</div>
                <div className="file-preview__meta">{formatBytes(file.size)}</div>
              </div>
              <button type="button" className="file-preview__remove" onClick={() => selectFile(null)}>
                Remove
              </button>
            </div>
          )}

          {uploadError && (
            <div className="import-center__banner import-center__banner--error">{uploadError}</div>
          )}

          <div className="import-center__actions">
            <button
              type="button"
              className="import-center__process"
              onClick={handleProcess}
              disabled={!file || status === 'uploading'}
            >
              {status === 'uploading' ? 'Processing…' : 'Process file'}
            </button>
          </div>
        </>
      )}

      {status === 'success' && result && (
        <div className="import-result">
          <div className="import-result__header">
            <h2>Import {result.status}</h2>
            <span className="import-result__filename">{result.filename}</span>
          </div>

          <div className="import-result__metrics">
            {RESULT_FIELDS.map(({ key, label }) => (
              <div key={key} className="import-result__metric">
                <span className="import-result__value">{result[key]}</span>
                <span className="import-result__label">{label}</span>
              </div>
            ))}
          </div>

          <dl className="import-result__files">
            <div>
              <dt>Processed file</dt>
              <dd>{result.processed_file}</dd>
            </div>
            <div>
              <dt>Validation report</dt>
              <dd>{result.validation_report}</dd>
            </div>
          </dl>

          <button type="button" className="import-result__reset" onClick={reset}>
            Import another file
          </button>
        </div>
      )}

      <style>{`
        .import-center {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          max-width: 640px;
        }
        .import-center__intro {
          color: var(--text-muted);
          font-size: var(--fs-small);
        }
        .dropzone {
          border: 2px dashed var(--border-strong);
          border-radius: var(--radius);
          padding: var(--space-7) var(--space-5);
          text-align: center;
          background: var(--bg-surface);
          cursor: pointer;
          transition: border-color 120ms ease, background-color 120ms ease;
        }
        .dropzone:hover,
        .dropzone--active {
          border-color: var(--accent);
          background: var(--accent-soft);
        }
        .dropzone__title {
          font-size: var(--fs-body);
          font-weight: 500;
        }
        .dropzone__hint {
          margin-top: var(--space-1);
          font-size: var(--fs-small);
          color: var(--text-muted);
        }
        .import-center__banner {
          background: var(--warn-soft);
          color: var(--warn);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          font-size: var(--fs-small);
        }
        .import-center__banner--error {
          background: var(--danger-soft);
          color: var(--danger);
        }
        .file-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
        }
        .file-preview__name {
          font-weight: 500;
          font-size: var(--fs-small);
        }
        .file-preview__meta {
          font-size: var(--fs-micro);
          color: var(--text-muted);
        }
        .file-preview__remove {
          background: none;
          border: none;
          color: var(--danger);
          font-size: var(--fs-small);
        }
        .import-center__actions {
          display: flex;
          justify-content: flex-end;
        }
        .import-center__process {
          padding: var(--space-3) var(--space-5);
          background: var(--accent);
          color: #fff;
          border: 1px solid var(--accent-strong);
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          font-weight: 500;
        }
        .import-center__process:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .import-result {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-top: 3px solid var(--accent);
          border-radius: var(--radius);
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .import-result__header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--space-3);
          flex-wrap: wrap;
        }
        .import-result__header h2 {
          font-size: var(--fs-h2);
        }
        .import-result__filename {
          font-size: var(--fs-small);
          color: var(--text-muted);
        }
        .import-result__metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: var(--space-4);
        }
        .import-result__metric {
          display: flex;
          flex-direction: column;
        }
        .import-result__value {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
        }
        .import-result__label {
          font-size: var(--fs-micro);
          color: var(--text-muted);
        }
        .import-result__files {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          font-size: var(--fs-small);
          border-top: 1px solid var(--border);
          padding-top: var(--space-4);
        }
        .import-result__files dt {
          color: var(--text-muted);
          font-size: var(--fs-micro);
        }
        .import-result__files dd {
          margin: 0;
          word-break: break-all;
        }
        .import-result__reset {
          align-self: flex-start;
          padding: var(--space-2) var(--space-4);
          border: 1px solid var(--border-strong);
          background: var(--bg-surface);
          border-radius: var(--radius-sm);
          font-size: var(--fs-small);
        }
      `}</style>
    </div>
  );
}
