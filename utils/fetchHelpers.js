export async function fetchRecipients() {
    try {
      const response = await fetch("/api/recipients");
      if (!response.ok) {
        throw new Error(`Failed to fetch recipients: ${response.statusText}`);
      }
      const data = await response.json();
      return data.recipients; // Assuming the API response contains a `recipients` array.
    } catch (error) {
      console.error("Error fetching recipients:", error);
      throw error; // Re-throw the error to handle it where the function is used.
    }
  }
  
  export async function fetchRecipientById(id) {
    try {
      const response = await fetch(`/api/recipients/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipient with ID ${id}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching recipient with ID ${id}:`, error);
      throw error;
    }
  }
  