//Models
const userModel = require("../models/User");

//Utility Functions
const generateToken = require("../utils/generateToken");

//NPM Packages
const bcrypt = require("bcryptjs");

/**
 * @description Signup
 * @route POST /api/user/signup
 * @access Public
 */
module.exports.userSignup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  //Edge cases and errors
  if (email === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Email is required", status: false }] });
  } else {
    //Regex
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid email address", status: false }] });
    }
  }
  if (password.length < 8) {
    return res.status(400).json({
      errors: [{ msg: "Password must be atleast 8 characters", status: false }],
    });
  }
  if (confirmPassword.length < 8) {
    return res.status(400).json({
      errors: [{ msg: "Password must be atleast 8 characters", status: false }],
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      errors: [{ msg: "Passwords don't match", status: false }],
    });
  }

  //Signup Logic
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already exists", status: false }] });
    } else {
      try {
        //Creating user
        const user = await userModel.create({
          email,
          password,
        });

        //Creating token and sending response
        const token = generateToken(user._id);
        return res.status(200).json({
          msg: "Account Created",
          token,
          status: true,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: error });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Login
 * @route POST /api/user/login
 * @access Public
 */
module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  //Edge cases and errors
  if (email === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Email is required", status: false }] });
  } else {
    //Regex
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid email address", status: false }] });
    }
  }
  if (password.length < 8) {
    return res.status(400).json({
      errors: [{ msg: "Password must be atleast 8 characters", status: false }],
    });
  }

  //Login logic
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (user) {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const token = generateToken(user._id);
        return res.status(200).json({
          msg: "Login Successfully",
          token,
          status: true,
        });
      } else {
        return res.status(400).json({
          errors: [{ msg: "Invalid Password", status: false }],
        });
      }
    } else {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Add Profile Details
 * @route PUT /api/user/add-profile-details
 * @access Private
 */
module.exports.addProfileDetails = async (req, res) => {
  const { _id } = req.user;
  const { firstName, lastName, gender, dob, country, profileImage } = req.body;

  //Edge cases and errors
  if (firstName === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "First Name is required", status: false }] });
  }
  if (lastName === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Last Name is required", status: false }] });
  }
  if (gender === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Gender is required", status: false }] });
  }
  if (dob === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Date of Birth is required", status: false }] });
  }
  if (country === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Country is required", status: false }] });
  }
  if (profileImage === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Profile Image is required", status: false }] });
  }

  //Logic
  try {
    const isUser = await userModel.findOne({ _id });
    if (!isUser) {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }
    await userModel.updateOne(
      { _id },
      { firstName, lastName, gender, dob, country, profileImage }
    );

    //Response
    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Add Body Images
 * @route PUT /api/user/add-body-images
 * @access Private
 */
module.exports.addBodyImages = async (req, res) => {
  const { _id } = req.user;
  const { bodyImages } = req.body;

  //Edge Cases
  if (bodyImages.length === 0) {
    return res.status(400).json({
      errors: [{ msg: "Full Body Images are required", status: false }],
    });
  }

  //Logic
  try {
    const isUser = await userModel.findOne({ _id });
    if (!isUser) {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }
    await userModel.updateOne({ _id }, { bodyImage: bodyImages });

    //Response
    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Add Importance
 * @route PUT /api/user/add-importance
 * @access Private
 */
module.exports.addImportance = async (req, res) => {
  const { _id } = req.user;
  const { importance } = req.body;

  //Edge Cases
  if (importance === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Importance is required", status: false }] });
  }

  //Logic
  try {
    const isUser = await userModel.findOne({ _id });
    if (!isUser) {
      return res.status(400).json({
        errors: [{ msg: "User not found", status: false }],
      });
    }
    await userModel.updateOne({ _id }, { importance });

    //Response
    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
