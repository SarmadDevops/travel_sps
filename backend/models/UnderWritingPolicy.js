module.exports = (sequelize, DataTypes) => {
  const UnderWritingPolicy = sequelize.define("UnderWritingPolicy", {

    // =========================
    // POLICY IDENTIFICATION
    // =========================
    policyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    // =========================
    // TRAVEL POLICY DETAILS
    // =========================

    travelPolicyFor: {
      // Pakistani National / Foreign National
      type: DataTypes.ENUM("PAKISTANI", "FOREIGN"),
      allowNull: false
    },

    covidCovered: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    dateFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },

    dateTo: {
      type: DataTypes.DATE,
      allowNull: false
    },

    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    countryToTravel: {
      type: DataTypes.STRING,
      allowNull: false
    },

     underWriterNotes: {
      type: DataTypes.TEXT,
       allowNull: true
    },

    superAdminNotes: {
      type: DataTypes.TEXT,
       allowNull: true
    },

    // =========================
    // POLICY TYPE & PACKAGE
    // =========================
    policyType: {
      type: DataTypes.ENUM("SINGLE", "FAMILY"),
      allowNull: false
    },

    packageType: {
      type: DataTypes.ENUM(
        "SCHENGEN",
        "WORLDWIDE",
        "REST_OF_WORLD",
        "DOMESTIC",
        "PAK_CARE",
        "STUDENT"
      ),
      allowNull: false
    },

    plan: {
      type: DataTypes.ENUM("GOLD", "DIAMOND", "PLATINUM"),
      allowNull: false
    },

    policyAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    // =========================
    // INSURED PERSON DETAILS
    // =========================
    insuredName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },

    passportNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    cnic: {
      type: DataTypes.STRING,
      allowNull: false
    },

    contactNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // =========================
    // BENEFICIARY DETAILS
    // =========================
    beneficiaryName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    beneficiaryRelationship: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // =========================
    // FAMILY (OPTIONAL)
    // =========================
    spouseName: DataTypes.STRING,
    spousePassport: DataTypes.STRING,
    spouseCnic: DataTypes.STRING,
    spouseDob: DataTypes.DATE,

    children: {
      type: DataTypes.JSON
      // [{ name, dob, passportNo }]
    },

    // =========================
    // RELATIONS
    // =========================
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    agentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    // =========================
    // STATUS (SUPER ADMIN)
    // =========================
   postStatus: {
  type: DataTypes.ENUM("POSTED", "UNPOSTED", "CANCELLED"),
  defaultValue: "UNPOSTED"
},


    paymentStatus: {
      type: DataTypes.ENUM("PAID", "UNPAID"),
      defaultValue: "UNPAID"
    }

  });

  return UnderWritingPolicy;
};
