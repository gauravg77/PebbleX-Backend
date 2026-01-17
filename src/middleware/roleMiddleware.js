const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('req.user is undefined');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Convert both to uppercase to prevent "SUPPLIER" vs "supplier" mismatch
    const userRole = req.user.role ? req.user.role.toUpperCase() : "";
    const requiredRole = role ? role.toUpperCase() : "";

    console.log(`User role: ${userRole}, Required role: ${requiredRole}`);

    if (userRole !== requiredRole) {
      return res.status(403).json({ 
        message: `Access denied. Role ${requiredRole} required.` 
      });
    }
    
    next();
  };
};

export default roleMiddleware;