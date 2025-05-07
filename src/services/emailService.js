
export const getEmailLogs = () => {
    return JSON.parse(localStorage.getItem("emailHistory")) || [];
  };
  
  export const deleteEmail = (emailLogs, emailToDelete) => {
    const updatedEmails = emailLogs.filter(email => email !== emailToDelete);
    localStorage.setItem("emailHistory", JSON.stringify(updatedEmails));
    return updatedEmails;
  };
  