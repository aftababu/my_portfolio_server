const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.getAllProject = asyncHandler(async (req, res, next) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.createProjectType = asyncHandler(async (req, res, next) => {
  try {
    const { label, value } = req.body;
    if (!label || !value) {
      return next(new ErrorHandler("Please enter all fields", 404));
    }
    console.log(req.body);
    const newProject = new Project({ label, value }); // Use destructured variables here
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  try {
    const projectcategoryId = req.params.projectcategoryId; // Assuming you pass the project ID in the URL
    const projectId = req.params.id; // Assuming you pass the project ID in the URL
    const updatedProject = req.body; // Assuming you send the updated project data in the request body

    let images = [];
    if (typeof req.body.images === "object") {
      images.push(...req.body.images);
    } else {
      images = req.body.images;
    }
    console.log(images);
    if (typeof req.body.images === "object") {
      const imagesLink = [];
      for (let i = 0; i < images.length; i++) {
        const result1 = await cloudinary.v2.uploader.upload(images[i], {
          folder: "myportfolio",
        });
        if (!result1) {
          return next(new ErrorHandler("Internal Server Error", 500));
        }
        imagesLink.push(result1.secure_url);
      }
      req.body.images = imagesLink;
    }

    const result = await Project.findByIdAndUpdate(
      projectcategoryId,
      { $set: { "projects.$[elem]": updatedProject } },
      { arrayFilters: [{ "elem._id": projectId }], new: true }
    );
    if (!result) {
      // If the project with the given ID is not found
      return next(new ErrorHandler("Project not found", 404));
    }
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

exports.deleteProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // Assuming you pass the project ID in the URL
    // Find the project by ID and remove it
    const result = await Project.findByIdAndDelete(id);

    if (!result) {
      // If the project with the given ID is not found
      return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Assuming you have a route for creating a project in a project category
exports.createNewProject = asyncHandler(async (req, res, next) => {
  try {
    const projectCategoryId = req.params.id; // Assuming you pass the project category ID in the URL
    const newProject = req.body; // Assuming you send the new project data in the request body
    const images = [...req.body.images];
    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      // Replace the cloudinary.v2.uploader.upload() function with your actual image upload logic
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "myportfolio",
      });
      if (!result) {
        return next(
          new ErrorHandler("Internal Server Error,cloud not upload images", 500)
        );
      }
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    newProject.images = imagesLink;
    console.log(newProject);
    const result = await Project.findByIdAndUpdate(
      projectCategoryId,
      { $push: { projects: newProject } },
      { new: true }
    );
    // const result = await Project.findById(projectCategoryId);
    console.log(result);
    if (!result) {
      return next(new ErrorHandler("Project category not found", 404));
    }
    // console.log(result)
    res.status(201).json(result);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

exports.deleteNewProject = asyncHandler(async (req, res, next) => {
  try {
    const projectCategoryId = req.params.projectcategoryId; // Assuming you pass the project category ID in the URL
    const projectId = req.params.id; // Assuming you pass the project ID in the URL

    // Find the removed project from the result
    const { projects } = await Project.findById(projectCategoryId, {
      projects: {
        $elemMatch: { _id: projectId },
      },
    });
    const projectsImages = projects[0].images;

    // // Delete the Cloudinary images associated with the removed project
    for (let i = 0; i < projectsImages.length; i++) {
      const deleteResult = await cloudinary.v2.uploader.destroy(
        projectsImages[i].public_id
      );
      if (deleteResult.result !== "ok") {
        return next(new ErrorHandler("Failed to delete Cloudinary image", 500));
      }
    }
    // console.log(removedProject.projects);
    const result = await Project.findByIdAndUpdate(
      projectCategoryId,
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );
    console.log(result);
    if (!result) {
      // If the project category or project with the given IDs is not found
      return next(
        new ErrorHandler("Project or project category not found", 404)
      );
    }
    res.status(200).json(result);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

// {
//   "_id": {
//     "$oid": "657ffd2ad20dd4ccb08ea572"
//   },
//   "label": "React with UI",
//   "value": "react_ui",
//   "projects": [
//     {
//       "title": "Game Hub",
//       "description": "This project is made with React TypeScript and Chakra UI. It is the latest project of Mosh Hamadani in 2023 React course.",
//       "images": [],
//       "github": "https://github.com/aftababu/game-hub",
//       "language": "React, TypeScript, Chakra UI",
//       "modules": "React, TypeScript, Chakra UI",
//       "projectUrl": "https://comfy-gnome-324ada.netlify.app/",
//       "_id": {
//         "$oid": "657ffd2ad20dd4ccb08ea573"
//       }
//     }
//   ],
//   "__v": 2
// }
