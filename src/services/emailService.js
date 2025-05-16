
export const getEmailLogs = () => {
    return JSON.parse(localStorage.getItem("emailHistory")) || [];
  };
  
  export const deleteEmail = (emailLogs, emailToDelete) => {
    const updatedEmails = emailLogs.filter(email => email !== emailToDelete);
    localStorage.setItem("emailHistory", JSON.stringify(updatedEmails));
    return updatedEmails;
  };
  export const getCompanyEmailLogs = () => {
  const allEmails = getEmailLogs();

  // Récupération de l'utilisateur connecté
  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (!currentUser || !currentUser.email || currentUser.role !== "COMPANY") {
    return [];
  }

  // Filtrage des emails envoyés par la company
  const companyEmails = allEmails.filter(email => email.sender === currentUser.email);

  return companyEmails;
};
