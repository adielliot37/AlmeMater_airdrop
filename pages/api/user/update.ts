import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/mongo-helper";

interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.headers["x-middleware-auth"] === process.env.KEY)) {
    res.status(401).json({ error: "Unauthorized call" });
  }
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    // RESPONSE FOR POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { User } = await connect();
      const { address } = req.body;
      delete req.body["address"];

      const existingUser = await User.findOne({ address: address });

      if (!existingUser) {
        // If the user doesn't exist, create a new document
        const newUser = new User({ address, ...req.body });
        const savedUser = await newUser.save().catch(catcher);
        res.json(savedUser);
      } else {
        // If the user exists, update the existing document
        const updatedUser = await User.findOneAndUpdate(
          { address: address },
          req.body,
          { new: true }
        ).catch(catcher);
        res.json(updatedUser);
      }
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
