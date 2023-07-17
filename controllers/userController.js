const multer = require('multer');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handler = require('./handlerFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only image!!', 404));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (body, ...allowedFields) => {
  const newBody = {};
  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) {
      newBody[el] = body[el];
    }
  });
  return newBody;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // ERROR IF POSTs PASSWORD DATA
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('this route is not for password update.', 404));
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  if(req.file) filteredBody.photo = req.file.filename;
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log('oksap');
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  console.log(user);
  res.status(204).json({
    status: 'success',
    user: null,
  });
});

exports.getAllUsers = handler.getAll(User);

exports.getUser = handler.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal server error!!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal server error!!',
  });
};

exports.deleteUser = handler.deleteOne(User);
