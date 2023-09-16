import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as binService from '../services/bins';
import { Bin } from '../types';
import CreateBin from './CreateBin';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

// TODO: Implement backend method to get the most recent request for a bin
// Then could drop this into the <ListItemAvatar> below
/*
  <Avatar style={{ backgroundColor: getMethodColor(request.method) }}>
    {getUniqueChars(bin.binPath)}
  </Avatar>
*/
const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: 'green',
    POST: 'blue',
    PUT: 'yellow',
    DELETE: 'red',
    PATCH: 'orange',
    HEAD: 'purple',
    OPTIONS: 'grey',
  };
  return colors[method] || 'grey';
};

const getUniqueChars = (binPath: string) => {
  // Using the first and last characters as an example
  return binPath[0] + binPath[binPath.length - 1];
};

const pleasingColors = [
  '#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb',
  '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784',
  '#aed581', '#ff8a65', '#d4e157', '#ffd54f', '#ffb74d'
];

const getAvatarColor = (binPath: string) => {
  const chars = getUniqueChars(binPath);
  const sumAscii = chars.charCodeAt(0) + chars.charCodeAt(1);
  const colorIndex = sumAscii % pleasingColors.length;
  return pleasingColors[colorIndex];
};



const HomePage = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const navigate = useNavigate();

  const handleDelete = async (binPath: string) => {
    try {
      await binService.deleteBin(binPath);  
      setBins(bins.filter(bin => bin.binPath !== binPath));
      navigate('/');
    } catch (error) {
      console.error("Failed to delete bin:", error);
      // Handle the error appropriately here
    }
  };

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const allBins = await binService.getAllBins();
        // Sort the bins by lastRequest, descending
        const sortedBins = [...allBins].sort((a: Bin, b: Bin) => {
          if (a.lastRequest == null && b.lastRequest == null) {
            return 0
          }
          if (a.lastRequest == null) {
            return 1;
          }
          if (b.lastRequest == null) {
            return -1;
          }
          // Convert each to new Date() to compare
          const bLR = new Date(b.lastRequest);
          const aLR = new Date(a.lastRequest);
          return bLR.getTime() - aLR.getTime();
        });
        setBins(sortedBins);
        console.log(`Fetched ${allBins.length} bins, first one is:`, allBins[0]);
        console.log(JSON.stringify(allBins, null, 2));
      } catch (error) {
        console.error("Failed to fetch bins:", error);
        // Handle the error appropriately here
      }
    };

    fetchBins();
  }, []);

  // Guard against empty bins
  if (bins.length === 0) {
    return (
      <div>
        <h1>Welcome to RequestBin</h1>
        <p>No bins found</p>
      </div>
    )
  }


  return (
    <div>
      <h1>Welcome to ReqBin</h1>
      <p>Create or view bins to inspect HTTP requests</p>
      <CreateBin />
      <h2>List of Bins</h2>
      <List>
        {Array.isArray(bins) && bins.map(bin => (
          <ListItem button component={Link} to={`/bins/${bin.binPath}`} key={bin.binPath}>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: getAvatarColor(bin.binPath) }}>
              {getUniqueChars(bin.binPath)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={bin.binPath} secondary={`Last Request: ${bin.lastRequest ? new Date(bin.lastRequest).toLocaleString() : 'Never'}`} />
          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(bin.binPath)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>        
        ))}
      </List>
    </div>
  );
}

export default HomePage;