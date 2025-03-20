


export const addMessage = async (req, res) => {
 // const tokenUserId = req.userId;

  try {
    
    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message !" });
  }
};