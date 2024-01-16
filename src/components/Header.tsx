import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{ marginLeft: '10%'}}>
        <Typography variant="h6" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
          <Link to="/" style={{ margin: 'auto', color: 'white', textDecoration: 'none' }}>
            {/* Request Jar - A RequestBin Clone */}
            <img src="/favicon.ico" alt="logo"/>
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
