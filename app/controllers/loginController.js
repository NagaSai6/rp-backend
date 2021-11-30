import User from "../models/user.js";
import jwt from "jsonwebtoken";

const loginController = () => {
  return {
    async fblogin(req, res) {
      User.findOne({ mail: req.body.email }).exec((err, user) => {
        if (err) {
          return res.status(400).json({ error: "Something went wrong" });
        } else {
          if (user) {
            let token = jwt.sign(
              { name: user.userName, email: user.mail ,image:req.body.picture.data.url,id:user._id},
              process.env.SECRET,
              {
                expiresIn: "7d",
              }
            );
            res.status(200).json({
              user: token,
            });
          } else {
            let newUser = new User({
              userName: req.body.name,
              mail: req.body.email,
              userId: req.body.id,
              accessToken: req.body.accessToken,
              image: req.body.picture.data.url,
            });
            newUser.save((err, user) => {
              if (err) {
                console.log(err);
                return res.status(200).json({ error: "Something went wrong" });
              } else {
                let token = jwt.sign(
                  { name: user.userName, mail: user.mail,image:req.body.picture.data.url,id:user._id },
                  process.env.SECRET,
                  {
                    expiresIn: "7d",
                  }
                );
                const { name, email } = user;
                res.status(200).json({
                  user: token,
                });
              }
            });
          }
        }
      });
    },
  };
};

export default loginController;
