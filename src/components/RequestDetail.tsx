import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as requestService from '../services/requests';
import { Request } from '../types';
import { JSONTree } from 'react-json-tree';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const RequestDetail = () => {
  const [request, setRequest] = useState<Request | null>(null);
  const { requestId, binPath } = useParams< { requestId: string, binPath: string } >();

  useEffect(() => {
    const fetchRequest = async () => {
      if (requestId == null || binPath == null) {
        return;
      }
      try {
        const fetchedRequest = await requestService.getRequestById(binPath, requestId);
        console.log(`Fetched request with id ${requestId}, first one is: ${JSON.stringify(fetchedRequest)}`);
        setRequest(fetchedRequest);
      } catch (error) {
        console.error(`Failed to fetch request with id ${requestId}:`, error);
        // Handle the error appropriately here
      }
    };

    fetchRequest();
  }, [requestId, binPath]);

  if (!request || !request.event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Request Detail</h2>
      <JSONTree data={request.event} theme={theme} invertTheme={true}/>
      {/* <p><strong>Method:</strong> {request.event.method} </p>
      <p><strong>Protocol Version:</strong> {request.event.protocol_version} </p>
      <p><strong>URL:</strong> {request.event.url} </p>
      <p><strong>Client IP:</strong> {request.event.client_ip} </p>
      <p><strong>Headers:</strong></p>
      {request.event.headers && (
        <>
          <ul>
            {Object.keys(request.event.headers).map(key => (
              <li key={key}><strong>{key}:</strong> {String(request.event.headers[key])}</li>
            ))}
          </ul>
        </>
      )}
      <p><strong>Path:</strong> {request.event.path} </p>
      <p><strong>Query:</strong> {JSON.stringify(request.event.query)} </p>
      <p><strong>Body:</strong> {JSON.stringify(request.event.body)} </p> */}

    </div>
  );
};

export default RequestDetail;