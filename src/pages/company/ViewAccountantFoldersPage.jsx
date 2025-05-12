import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Container } from 'react-bootstrap';
import {
    FaFolder,
    FaSearch,
    FaRegCalendarAlt
} from 'react-icons/fa';

// Components
import CompanyLayout from "../../components/company/CompanyLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

const ViewAccountantFolder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const accountantName = location.state?.accountantName || id;


    // Fetch folders on component mount
    useEffect(() => {
        const storedFolders = localStorage.getItem(`folders-${id}`);
        if (storedFolders) {
            setFolders(JSON.parse(storedFolders));
            setLoading(false);
        } else {
            const fetchFolders = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:9090/api/folders/by-internal-accountant/${id}`
                    );
                    setFolders(response.data);
                    // Store the folders in localStorage
                    localStorage.setItem(`folders-${id}`, JSON.stringify(response.data));
                } catch (error) {
                    console.error("Error fetching folders:", error);
                    toast.error("Failed to load folders");
                } finally {
                    setLoading(false);
                }
            };

            fetchFolders();
        }
    }, [id]);

    // Event handlers
    const handleFolderClick = (folderId) => {
        navigate(`/folders/${folderId}/invoices`);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Utility functions
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const filteredFolders = folders.filter(folder => {
        const query = searchQuery.toLowerCase();
        return (
            folder.folderName?.toLowerCase().includes(query) ||
            folder.client?.name.toLowerCase().includes(query)
        );
    });

    // Loading state
    if (loading) {
        return (
            <CompanyLayout>
                <LoadingSpinner
                    size="lg"
                    color="primary"
                    fullScreen
                    text="Loading Folders..."
                />
            </CompanyLayout>
        );
    }

    return (
        <CompanyLayout>
            <Container className="px-4 py-8">
                {/* Header with search */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="text-2xl font-semibold">
                        Folders for Accountant {accountantName}
                    </h2>
                    <div className="position-relative">
                        <FaSearch className="position-absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search folders..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="ps-5 pe-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                        />
                    </div>
                </div>
                {/* Folders list */}
                <div className="folder-list">
                    {filteredFolders.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            {searchQuery ? "No matching folders found" : "No folders available"}
                        </div>
                    ) : (
                        <ul className="list-unstyled">
                            {filteredFolders.map(folder => (
                                <li key={folder.id} className="mb-3">
                                    <div
                                        className="folder-item card card-hover p-3"
                                        onClick={() => handleFolderClick(folder.id)}
                                        style={{ backgroundColor: '#f8f9fa' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="folder-icon me-3">
                                                <FaFolder
                                                    size={48}
                                                    style={{
                                                        color: '#6f42c1',  // Couleur violette
                                                        minWidth: '48px'   // Taille fixe pour l'icône
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <h5 className="folder-title mb-0">
                                                        {folder.folderName || "Unnamed Folder"}
                                                    </h5>
                                                </div>

                                                <p className="text-muted small mb-2">
                                                    {folder.client?.name || "No client assigned"}
                                                </p>

                                                <div className="text-muted small d-flex align-items-center">
                                                    <FaRegCalendarAlt className="me-1" />
                                                    {formatDate(folder.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Container>
        </CompanyLayout>
    );
};

export default ViewAccountantFolder;
