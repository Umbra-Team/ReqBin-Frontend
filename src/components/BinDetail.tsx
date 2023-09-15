import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as binService from '../services/bins';
import { Bin, Request } from '../types';
import { apiBaseUrl } from '../constants';
import { Card, CardContent, Typography, List, ListItem, Button } from '@mui/material';


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
    <div style={{ padding: '20px' }}>
      <Typography variant="h3" gutterBottom>
        Bin Detail - {bin.binPath}
      </Typography>
      <Typography variant="subtitle1">
        Created At: {new Date(bin.createdAt).toLocaleString()}
      </Typography>
      <Typography variant="subtitle1">
        Last Request: {bin?.lastRequest ? new Date(bin.lastRequest).toLocaleString() : 'Never'}
      </Typography>
      <Typography variant="subtitle1">
        Number of Requests: {requests.length}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        The unique URL to trigger this workflow is:
      </Typography>
      <Card variant="outlined" style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="body1">
            <code>{`${window.location.origin}/api/bins/${binPath}/incoming`}</code>
            <Button variant="contained" color="primary" onClick={handleCopyClick}>
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </Typography>
        </CardContent>
      </Card>
      <List>
        {requests.map(request => (
          <ListItem button component={Link} to={`/bins/${binPath}/requests/${request.id}`} key={request.id}>
            <Typography variant="body2">
              {request.event.method} {request.event.url}
            </Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BinDetail;
