const router = require("express").Router();

//controller functions
const {
  userSignup,
  userLogin,
  addProfileDetails,
  addBodyImages,
  addImportance,
} = require("../controllers/user");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/signup").post(userSignup);
router.route("/login").post(userLogin);

router.route("/add-profile-details").put(verifyUser, addProfileDetails);
router.route("/add-body-images").put(verifyUser, addBodyImages);
router.route("/add-importance").put(verifyUser, addImportance);

module.exports = router;