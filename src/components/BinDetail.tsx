import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as binService from '../services/bins';
import { Bin, Request } from '../types';
import { apiBaseUrl } from '../constants';

const BinDetail = () => {
  const [bin, setBin] = useState<Bin | null>(null);
  const [requests, setRequests] = useState<Request[] | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { binPath } = useParams<{ binPath: string }>();

  const handleCopyClick = () => {
    // TODO: change this to use host from window.location
    navigator.clipboard.writeText(`${window.location.origin}/api/bins/${binPath}/incoming`);
    setIsCopied(true);

    // Reset the isCopied state after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  function updateBinLastRequest(prevBin: Bin | null, newTimestamp: any): Bin | null {
    if (!prevBin) {
      return null;
    }
    return {
      ...prevBin,
      lastRequest: newTimestamp,
    };
  }

  useEffect(() => {
    const fetchBin = async () => {
      console.log(`binPath: ${binPath}`)
      if (binPath == null) {
        return;
      }
      try {
        const fetchedBin = await binService.getOneBin(binPath);
        console.log(`Fetched bin with path ${binPath}, first one is: ${JSON.stringify(fetchedBin)}`);
        setBin(fetchedBin);
      } catch (error) {
        console.error(`Failed to fetch bin with path ${binPath}:`, error);
        // Handle the error appropriately here
      }
    };

    const fetchRequests = async () => {
      if (binPath == null) {
        return;
      }
      try {
        const fetchedRequests = await binService.getRequestsByBinPath(binPath);
        console.log(`Fetched ${fetchedRequests.length} requests for bin ${binPath}, first one is: ${fetchedRequests[0]}`);
        setRequests(fetchedRequests);
      } catch (error) {
        console.error(`Failed to fetch requests for bin with path ${binPath}:`, error);
      }
    };

    fetchBin();
    fetchRequests();
  }, [binPath]);

  
  useEffect(() => {
    //  use apiBaseUrl to get the base URL of the API server
    // const eventSource = new EventSource(`http://localhost:3001/api/bins/${binPath}/events`);
    const eventSource = new EventSource(`${apiBaseUrl}/bins/${binPath}/events`);
  
    // This event listener will be called every time a new request is made to the bin
    eventSource.onmessage = (event: MessageEvent) => {
      console.log(`requests: ${JSON.stringify(requests)}`);
      let newRequest: Request;
      try {
        newRequest = JSON.parse(event.data);
        console.log(`newRequest: ${JSON.stringify(newRequest)}`);

        // Update the bin's lastRequest property
        setBin((prevBin) => updateBinLastRequest(prevBin, newRequest.timestamp));
      } catch (error) {
        console.error(`Failed to parse event data: ${event.data}`);
        return;
      }
      
      setRequests((requests) => [...(Array.isArray(requests) ? requests : []), newRequest]);
    };
  
    return () => {
      eventSource.close();
    };
  }, [requests, binPath]);
  

  if (!bin ) {
    console.log(`Bin: ${bin}, Requests: ${requests}`)
    return <div>Loading...</div>;
  }

  if (requests == null) {
    return <div>Waiting for requests...</div>;
  }

  return (
    <div>
      <h2>Bin Detail - {bin.binPath}</h2>
      <p>Created At: {new Date(bin.createdAt).toLocaleString()}</p>
      <>Last Request: {bin?.lastRequest ? new Date(bin.lastRequest).toLocaleString() : 'Never'}</>
      <p>Number of Requests: {requests.length}</p>
      <p>The unique URL to trigger this workflow is:</p>
      <p>  
        <code>{`${window.location.origin}/api/bins/${binPath}/incoming`}</code>
        <span 
          className={`mdi ${isCopied ? 'mdi-check' : 'mdi-content-copy'}`} 
          onClick={handleCopyClick}
          style={{ cursor: 'pointer' }}
        >
        </span>
      </p>
      <ul>
        {requests.map(request => (
          <li key={request.id}>
            <Link to={`/bins/${binPath}/requests/${request.id}`}>{request.event.method} {request.event.url}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BinDetail;
