import React, { useContext, useEffect, useState } from 'react';
import { FolderContext } from '../../components/folder/FolderContext';
import { Button, Container, Row, Col,Card } from 'react-bootstrap';
import FolderForm from './FolderForm';
import { ContextMenuTrigger } from 'react-contextmenu';
import '../../styles/folderList.css';
import { FaFolder } from 'react-icons/fa';
import FolderContextMenu from '../../components/folder/FolderContextMenu';
const FolderList = () => {
  const { folders, addFolder, deleteFolder } = useContext(FolderContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [addedFolders,setAddedFolders] = useState(folders);

  //Synchronize the added folders state
  useEffect(() => {
    setAddedFolders(folders);
  }, [folders]);


  const handleSaveFolder = (newFolder) => {
    addFolder(newFolder);
    setShowForm(false);
  };

  const handleAction = (action, folderId) => {
    const folder = folders.find((f) => f._id === folderId);
    if (!folder) return;

    switch (action) {
      case 'delete':
        deleteFolder(folderId);
        break;
      case 'modify':
      
        break;
      case 'favorite':
        
        break;
      case 'archive':
       
        break;
      case 'details':
       
        break;
      case 'clientInfo':
       
        break;
      default:
        break;
    }
  };

  return (
    <Container fluid className="d-flex vh-100 p-0">
      {/* Left Side: Folder List */}
      <div className="d-flex flex-column flex-grow-1 p-4">
        <Row className="d-flex justify-content-between align-items-center mb-4">
          <Col>
            <h2 className="h2 fw-semibold mb-0">My Folders</h2>
          </Col>
          <Col className="text-end">
            <Button
               className="px-4 py-2 add-folder-button"
              onClick={() => setShowForm(true)}
            >
              + Add Folder
            </Button>
          </Col>
        </Row>

        {/* Folder List */}
        <Row className="g-4">
          {addedFolders.map((folder) => (
            <Col xs={12} md={6} lg={4} key={folder._id}>
              <ContextMenuTrigger id={`folder-${folder._id}`}>
                <div
                  className={`folder-item ${
                    selectedFolder === folder ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFolder(folder)}
                >
                  <Card
                    className={`p-3 shadow-sm ${
                      selectedFolder === folder ? "border-secondary" : ""
                    }`}
                    style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="folder-icon me-3">
                        <FaFolder size={40}  />
                      </div>
                      <div className="folder-details">
                        <div className="folder-name fw-semibold">
                          {folder.folderName}
                        </div>
                        <div className="folder-client text-muted">
                          {folder.client?.name || "N/A"}
                        </div>
                        <div className="folder-date text-muted small">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </ContextMenuTrigger>
            </Col>
          ))}
        </Row>
      </div>

      {/* Folder Context Menus */}
      {folders.map((folder) => (
        <FolderContextMenu
          key={folder._id}
          folderId={folder._id}
          onAction={handleAction}
        />
      ))}

      {/* Folder Form Modal */}
      <FolderForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleSaveFolder}
      />
    </Container>
  );
};

export default FolderList;
