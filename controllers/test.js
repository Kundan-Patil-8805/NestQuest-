import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
      console.log(req.userId);
      

    // Optionally, you can add payload validation or user context here
    res.status(200).json({ message: "You are authenticated" });
  
};


export const shouldBeAdmin = async (req,res) =>{
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({
          message: "Token is not valid",
        });
       
        
       
         
      }
      if(!payload.isAdmin)
        return res.status(403).json({
          message: "not authorized",
        });

  
      // Optionally, you can add payload validation or user context here
      res.status(200).json({ message: "You are authenticated" });
    });
}