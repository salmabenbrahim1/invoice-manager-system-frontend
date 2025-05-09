import axios from 'axios';

const API_URL = 'http://localhost:9090/api/accountants/internal';

const getInternalAccountants = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des comptables internes");
  }
};

const addInternalAccountant = async (formData, token) => {
  try {
    await axios.post(API_URL, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error("Erreur lors de l'ajout du comptable interne");
  }
};

const updateInternalAccountant = async (id, formData, token) => {
  try {
    await axios.put(`${API_URL}/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error("Erreur lors de la modification du comptable interne");
  }
};

const toggleAccountantActivation = async (id, isActive, token) => {
  const url = `${API_URL}/${id}/${isActive ? "deactivate" : "activate"}`;
  try {
    await axios.put(url, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error("Erreur lors du changement d'état");
  }
};



export { getInternalAccountants, addInternalAccountant, updateInternalAccountant, toggleAccountantActivation};
