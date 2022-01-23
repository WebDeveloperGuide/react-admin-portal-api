import express from 'express';
import UserModel from "../models/user.model.js";

export const registerUser = (req,res) => {

	try {

    	if (req.body && req.body.username && req.body.password && req.body.email) {

	      	UserModel.find({ email: req.body.email }, (err, data) => {

		        if (data.length == 0) {

		          let User = new UserModel({
		            username: req.body.username,
		            email: req.body.email,
		            password: req.body.password
		          });
		          User.save((err, data) => {
		            if (err) {
		              res.status(400).json({
		                errorMessage: err,
		                status: false
		              });
		            } else {
		              res.status(200).json({
		                status: true,
		                title: 'User Registered Successfully.'
		              });
		            }
		          });

		        } else {
		          res.status(400).json({
		            errorMessage: `User with ${req.body.email} already exist!`,
		            status: false
		          });
		        }

		      });

		    } else {
		      res.status(400).json({
		        errorMessage: 'Please fill all the fields',
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