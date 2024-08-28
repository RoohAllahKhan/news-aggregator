import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../AuthContext";


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userName, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
    handleClose();
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            News Aggregator
          </Link>
        </Typography>
        {isMobile ? (
          <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <>
                (<MenuItem>
                  <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="search"
                        onClick={handleSearchClick}
                    >
                        <SearchIcon />
                    </IconButton>
                </MenuItem>)
              </>
              {!isLoggedIn ? (
                <>
                  <MenuItem component={Link} to="/login" onClick={handleClose}>
                    Login
                  </MenuItem>
                  <MenuItem component={Link} to="/register" onClick={handleClose}>
                    Register
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem disabled>Hello, {userName}</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box>
              <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="search"
                    onClick={handleSearchClick}
                >
                    <SearchIcon />
                </IconButton>
            {!isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ display: "inline", marginRight: 2, marginLeft: 2 }}>
                  Hello, {userName}
                </Typography>
                <Button color="inherit" component={Link} to="preferences">
                  Preferences
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
