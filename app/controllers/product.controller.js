import ProductModel from "../models/product.model.js";

export const getProducts = (req,res) => {
	try {
	    var query = {};
	    query["$and"] = [];
	    query["$and"].push({
	      is_delete: false,
	      user_id: req.user.id
	    });

	    if (req.query && req.query.search) {
	      query["$and"].push({
	        name: { $regex: req.query.search }
	      });
	    }

	    var perPage = 5;
	    var page = req.query.page || 1;

	    ProductModel.find(query, { date: 1, name: 1, id: 1, desc: 1, price: 1, discount: 1, image: 1 })
	      .skip((perPage * page) - perPage).limit(perPage)
	      .then((data) => {
	        ProductModel.find(query).count()
	          .then((count) => {

	            if (data && data.length > 0) {
	              res.status(200).json({
	                status: true,
	                title: 'Product retrived.',
	                products: data,
	                current_page: page,
	                total: count,
	                pages: Math.ceil(count / perPage),
	              });
	            } else {
	              res.status(400).json({
	                errorMessage: 'There is no product available.',
	                status: false
	              });
	            }

	          });

	      }).catch(err => {
	        res.status(400).json({
	          errorMessage: err.message || err,
	          status: false
	        });
	      });
	  } catch (e) {
	    res.status(400).json({
	      errorMessage: 'Something went wrong!',
	      status: false
	    });
	  }
}

export const addProduct = (req,res) => {

	try {

	    if (req.body && req.body.name && req.body.price) {

	      let newProduct = new ProductModel();
	      newProduct.product_name = req.body.name;
	      newProduct.product_description = req.body.desc;
	      newProduct.price = req.body.price;
	      newProduct.discount = req.body.discount;
	      newProduct.user_id = req.user.id;
	      newProduct.save((err, data) => {
	        if (err) {
	          res.status(400).json({
	            errorMessage: err,
	            status: false
	          });
	        } else {
	          res.status(200).json({
	            status: true,
	            title: 'Product Added successfully.'
	          });
	        }
	      });

	    } else {
	      res.status(400).json({
	        errorMessage: 'Add proper parameter first!',
	        status: false
	      });
	    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!1212',
      status: false
    });
  }
};

export const updateProduct = (req,res) => {
	try {
	    if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
	      req.body.id && req.body.discount) {

	      ProductModel.findById(req.body.id, (err, newProduct) => {

	        if (req.body.name) {
	          newProduct.name = req.body.name;
	        }
	        if (req.body.desc) {
	          newProduct.desc = req.body.desc;
	        }
	        if (req.body.price) {
	          newProduct.price = req.body.price;
	        }
	        if (req.body.discount) {
	          newProduct.discount = req.body.discount;
	        }

	        newProduct.save((err, data) => {
	          if (err) {
	            res.status(400).json({
	              errorMessage: err,
	              status: false
	            });
	          } else {
	            res.status(200).json({
	              status: true,
	              title: 'Product updated successfully.'
	            });
	          }
	        });

	      });

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
}

export const deleteProduct = (req,res) => {
	try {
	    if (req.body && req.body.id) {
	      ProductModel.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
	        if (data.is_delete) {
	          res.status(200).json({
	            status: true,
	            title: 'Product deleted successfully.'
	          });
	        } else {
	          res.status(400).json({
	            errorMessage: err,
	            status: false
	          });
	        }
	      });
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
}