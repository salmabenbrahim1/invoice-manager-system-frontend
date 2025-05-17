
export const getEmailLogs = () => {
    return JSON.parse(localStorage.getItem("emailHistory")) || [];
  };
  
  export const deleteEmail = (emailLogs, emailToDelete) => {
    const updatedEmails = emailLogs.filter(email => email !== emailToDelete);
    localStorage.setItem("emailHistory", JSON.stringify(updatedEmails));
    return updatedEmails;
  };
 

  export const getCompanyEmailLogs = () => {
  return JSON.parse(localStorage.getItem("companyEmailHistory")) || [];
};

export const deleteCompanyEmail = (emailLogs, emailToDelete) => {
  const updatedEmails = emailLogs.filter(
    email => email.date !== emailToDelete.date 
  );
  localStorage.setItem("companyEmailHistory", JSON.stringify(updatedEmails));
  return updatedEmails;
};
