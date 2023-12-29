const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },

    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        images: {
          type: [
            {
              public_id: {
                type: String,
                required: true,
              },
              url: {
                type: String,
                required: true,
              },
            },
          ],
          required: true,
        },
        github: {
          type: String,
          required: true,
        },
        language: {
          type: String,
          required: true,
        },
        modules: {
          type: String,
          required: true,
        },
        projectUrl: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
