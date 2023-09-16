import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>
            ReqBin - A RequestBin Clone
          </Link>
        </Typography>
        <nav>
          <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/bins" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>
            Bins
          </Link>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
