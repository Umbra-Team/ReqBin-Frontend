import axios from 'axios'
import { apiBaseUrl } from '../constants';
import { Request } from '../types';

export const getAllRequests = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/requests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all requests:", error);
    throw error;
  }
}

// Returns a Promise that resolves to a Request object
// PROBLEM / TODO - We need binPath to be able to fetch a request by id
// GET /api/bins/:binPath/requests/:reqId -- retrieve a specific request
export const getRequestById : (binPath: string, id: string) => Promise<Request> = async (binPath:string, id: string) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/bins/${binPath}/requests/${id}`);
    console.log(`getRequestById - fetched request ${id} - response.data:`, response.data)
    return response.data;
  } catch (error) {
    console.error(`Error fetching request with id ${id}:`, error);
    throw error;
  }
}

// Delete a request
export const removeRequest = async (id: string) => {
  try {
    const response = await axios.delete(`${apiBaseUrl}/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting request with id ${id}:`, error);
    throw error;
  }
};
