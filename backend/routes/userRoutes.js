const express = require("express");
const User = require("../models/Users");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

/* READ → admin + user */
router.get("/", auth, role(["admin", "user"]), async (req, res) => {
  try {
    const users = await User.find().populate("city", "_id name").select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
  
});
/* Get User By Id */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

/* CREATE → admin only */
router.post("/", auth, role(["admin"]), async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
    
});

/* UPDATE → admin only */
router.put("/:id", auth, role(["admin", "user"]), async (req, res) => {
  try {
    const { name, email, age, city, role: userRole} = req.body;

    // Build update object with only allowed fields
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (city) updateData.city = city;

    // Only admins can update role
    if (userRole && req.user.role === 'admin') {
      updateData.role = userRole;
    }

    // Hash password if provided
    if (typeof password === "string" && password.length > 0) {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(password, 10);
    }

    const currentUser = await User.findById(req.params.id);
    if (!currentUser) {
      res.status(404).json({ errors: { email: "User not found" }});
    }

    // Check if email is being changed and already exists
    if (email && email !== currentUser.email) {
      const existingUser = await User.findOne({email, _id: {$ne: req.params.id}});
      if (!existingUser) {
        res.status(409).json({ errors: { email: "Email already exists" }});
      }
    }

    // Users can only update their own profile (unless admin)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      res.status(409).json({message: "You can only update your own profile" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password: _, ...userData } = updatedUser.toObject();
    
    res.status(200).json(userData);
        
  } catch (error) {
    console.error("Update user error:", error.message);
  
    // Handle CastError (age: "sfdfs")
    if (error.name === "CastError") {
      return res.status(400).json({
        errors: {
          [error.path]: `${error.path} must be a number`
        }
      });
    }

    // Handle schema validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ errors });
    }

    res.status(500).json({ message: error.message });

    res.status(500).json({message: error.message});
  }
    
});

/* DELETE → admin only */
router.delete("/:id",  auth, role(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({message: error.message}); 
  }
});

//Get Users By City
router.get('/users-by-city', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: '_id',
          as: 'cityData'
        }
      },
      { $unwind: "$cityData"},
      {
        $group: {
          _id: '$cityData.name',
          users: {
            $push: {
              _id: '$_id',
              name: '$name',
              email: '$email',
              age: '$age',
            }
          }
        }
      },
      {
        $project: {
          _id: '0',
          city: '$_id',
          users: 1
        }
      }
    ]);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

module.exports = router;
