import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../models/user.model.js";

export const loginUser = (req,res) => {

	try {
	    if (req.body && req.body.email && req.body.password) {
	      UserModel.find({ email: req.body.email }, (err, data) => {
	        if (data.length > 0) {

	          if (bcrypt.compareSync(data[0].password, req.body.password)) {
	            checkUserAndGenerateToken(data[0], req, res);
	          } else {

	            res.status(400).json({
	              errorMessage: 'Username or password is incorrect!',
	              status: false
	            });
	          }

	        } else {
	          res.status(400).json({
	            errorMessage: 'Username or password is incorrect!',
	            status: false
	          });
	        }
	      })
	    } else {
	      res.status(400).json({
	        errorMessage: 'Add proper parameter first!',
	        status: false
	      });
	    }
	} catch (e) {
	    res.status(400).json({
	      errorMessage: 'Something went wrong!',
	      status: false
	    });
	}
};

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.email, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true
      });
    }
  });
}