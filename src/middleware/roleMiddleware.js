const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('req.user is undefined');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log(`User role: ${req.user.role}, Required role: ${role}`);
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export default roleMiddleware;
