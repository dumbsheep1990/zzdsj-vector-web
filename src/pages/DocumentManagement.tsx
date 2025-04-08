import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentList } from '../components/modules/qa/DocumentList';
import { mockDocuments } from '../utils/mockData/qaData';
import PageHeader from '../components/layout/PageHeader';

const DocumentManagement: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    if (documentId) {
      setSelectedDocument(documentId);
    }
  }, [documentId]);

  const handleSelectDocument = (docId: string) => {
    setSelectedDocument(docId);
    navigate(`/document/${docId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="文档管理" />
      <div className="flex-1 p-6 overflow-auto">
        <DocumentList 
          assistantId="default" 
          onSelectDocument={handleSelectDocument}
        />
      </div>
    </div>
  );
};

export default DocumentManagement; 