const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Not a donar account");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate (OUT) Blood Quanitity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Reocrd Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error,
    });
  }
};

// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};

const getBloodStockByOrganisation = async (req, res) => {
  const { bloodGroup } = req.body; 

  if (!bloodGroup) {
    return res.status(400).send({
      success: false,
      message: "Blood group is required",
    });
  }

  try {

    const organisations = await userModel.find({ role: "organisation" });

    if (!organisations || organisations.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No organisations found",
      });
    }

    const result = [];

    for (const org of organisations) {

      const inventory = await inventoryModel.find({
        organisation: org._id,
        bloodGroup: bloodGroup, 
      });

      let totalIn = 0;
      let totalOut = 0;

      inventory.forEach(item => {
        if (item.inventoryType === "in") {
          totalIn += item.quantity;
        } else if (item.inventoryType === "out") {
          totalOut += item.quantity;
        }
      });

      const remainingBlood = totalIn - totalOut;

      if (remainingBlood > 0) {
        result.push({
          Name: org.name, 
          address: org.address, 
          website: org.website, 
          email: org.email, 
          phone: org.phone,
          bloodGroup,
          remainingBlood,
        });
      }
    }

    return res.status(200).send({
      success: true,
      message: "Blood stock by organisation fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in fetching blood stock by organisation",
      error,
    });
  }
};
const getBloodStockByHospital = async (req, res) => {
  const { bloodGroup } = req.body; // The user provides the desired blood group in the request body

  if (!bloodGroup) {
    return res.status(400).send({
      success: false,
      message: "Blood group is required",
    });
  }

  try {
    
    const hospitals = await userModel.find({ role: "hospital" });

    if (!hospitals || hospitals.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No hospitals found",
      });
    }

    const result = [];

    for (const hosp of hospitals) {
      
      const inventory = await inventoryModel.find({
        $or: [
          { organisation: hosp._id }, 
          { donor: hosp._id }         
        ],
        bloodGroup: bloodGroup, 
      });

      let totalIn = 0;
      let totalOut = 0;

      inventory.forEach(item => {
        if (item.inventoryType === "in") {
          totalIn += item.quantity;
        } else if (item.inventoryType === "out") {
          totalOut += item.quantity;
        }
      });

      const remainingBlood = totalIn - totalOut;

      if (remainingBlood > 0) {
        result.push({
          Name: hosp.name, 
          address: hosp.address, 
          website: hosp.website, 
          email: hosp.email, 
          phone: hosp.phone,
          bloodGroup,
          remainingBlood,
        });
      }
    }

    // Send response
    return res.status(200).send({
      success: true,
      message: "Blood stock by hospital fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in fetching blood stock by hospital",
      error,
    });
  }
};




// GET Hospital BLOOD RECORS
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get hospital comsumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get consumer Inventory",
      error,
    });
  }
};

// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};

// GET DONAR REOCRDS
const getDonarsController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find donars
    const donorId = await inventoryModel.distinct("donar", {
      organisation,
    });

    const donars = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donar Record Fetched Successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donar records",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //GET HOSPITAL ID
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    //FIND HOSPITAL
    const hospitals = await userModel.find({
      _id: { $in: hospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Hospital API",
      error,
    });
  }
};

// GET ORG PROFILES
const getOrgnaisationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donar });
    //find org
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG API",
      error,
    });
  }
};
// GET ORG for Hospital
const getOrgnaisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    //find org
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital ORG API",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getBloodStockByOrganisation,
  getBloodStockByHospital,
  getDonarsController,
  getHospitalController,
  getOrgnaisationController,
  getOrgnaisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};
