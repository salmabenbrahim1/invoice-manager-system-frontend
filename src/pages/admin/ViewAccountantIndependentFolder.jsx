import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const ViewAccountantIndependentFolder = () => {
  const { id } = useParams();
  const location = useLocation();
  const accountantName = location.state?.accountantName || "INDEPENDENT_ACCOUNTANT";

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('token');  // ou là où tu stockes ton JWT
      const response = await axios.get(
        `http://localhost:9090/api/folders/by-independent-accountant/${id}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFolders(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des dossiers :", error);
    } finally {
      setLoading(false);
    }
  };

  fetchFolders();
}, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Chargement des dossiers..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Supervision – Dossiers de {accountantName}
        </h2>

        {folders.length === 0 ? (
          <p className="text-gray-500">Aucun dossier trouvé pour ce comptable indépendant.</p>
        ) : (
          <ul className="space-y-4">
            {folders.map((folder) => (
              <li key={folder.id} className="border p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{folder.name}</h3>
                <p className="text-sm text-gray-600">Client : {folder.clientName}</p>
                <p className="text-sm text-gray-600">
                  Nombre de factures : {folder.invoices?.length || 0}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewAccountantIndependentFolder;
