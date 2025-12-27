const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const {
  Company,
  User,
  Employee,
  Team,
  Location,
  WorkCenter,
  Equipment,
  Notification,
} = require("../models");

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/gearguard"
  );
  console.log("✅ MongoDB Connected");
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      Company.deleteMany({}),
      User.deleteMany({}),
      Employee.deleteMany({}),
      Team.deleteMany({}),
      Location.deleteMany({}),
      WorkCenter.deleteMany({}),
      Equipment.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Create Company
    console.log("🏢 Creating company...");
    const company = await Company.create({ name: "GearGuard Industries" });

    // Create Admin User
    console.log("👤 Creating admin user...");
    const adminUser = await User.create({
      name: "Ketul Suthar",
      email: "admin@gearguard.com",
      password: "admin123",
      company: company._id,
      role: "admin",
    });

    // Create Locations
    console.log("📍 Creating locations...");
    const locations = await Location.insertMany([
      {
        name: "Production Floor",
        address: "Building A, Floor 1",
        company: company._id,
        type: "area",
      },
      {
        name: "Assembly Line A",
        address: "Building A, Floor 2",
        company: company._id,
        type: "area",
      },
      {
        name: "Assembly Line B",
        address: "Building B, Floor 1",
        company: company._id,
        type: "area",
      },
      {
        name: "Warehouse",
        address: "Building C",
        company: company._id,
        type: "building",
      },
    ]);

    // Create Work Centers
    console.log("🏭 Creating work centers...");
    const workCenters = await WorkCenter.insertMany([
      {
        name: "Machine Shop",
        workCenterGroup: "Manufacturing",
        company: company._id,
        location: locations[0]._id,
      },
      {
        name: "Welding Station",
        workCenterGroup: "Manufacturing",
        company: company._id,
        location: locations[0]._id,
      },
      {
        name: "Quality Control",
        workCenterGroup: "QC",
        company: company._id,
        location: locations[1]._id,
      },
      {
        name: "Packaging",
        workCenterGroup: "Logistics",
        company: company._id,
        location: locations[3]._id,
      },
    ]);

    // Create Employee Users & Employees
    console.log("👥 Creating employees...");
    const empData = [
      {
        name: "John Smith",
        email: "john.smith@company.com",
        dept: "Maintenance",
        pos: "Senior Technician",
      },
      {
        name: "Sarah Johnson",
        email: "sarah.j@company.com",
        dept: "Engineering",
        pos: "Maintenance Engineer",
      },
      {
        name: "Mike Brown",
        email: "mike.b@company.com",
        dept: "Maintenance",
        pos: "Maintenance Technician",
      },
      {
        name: "Emily Davis",
        email: "emily.d@company.com",
        dept: "Operations",
        pos: "Operations Supervisor",
      },
    ];

    const employees = [];
    for (let i = 0; i < empData.length; i++) {
      const user = await User.create({
        name: empData[i].name,
        email: empData[i].email,
        password: "password123",
        company: company._id,
        role: "technician",
      });
      const emp = await Employee.create({
        user: user._id,
        employeeCode: `EMP-${String(i + 1).padStart(4, "0")}`,
        company: company._id,
        department: empData[i].dept,
        position: empData[i].pos,
        phone: `555-010${i + 1}`,
        status: "active",
        location: locations[i % locations.length].name,
      });
      employees.push(emp);
    }

    // Create Teams
    console.log("👥 Creating teams...");
    await Team.insertMany([
      {
        name: "Maintenance Team A",
        leader: employees[0]._id,
        company: company._id,
        members: [
          { employee: employees[0]._id },
          { employee: employees[2]._id },
        ],
      },
      {
        name: "Engineering Team",
        leader: employees[1]._id,
        company: company._id,
        members: [{ employee: employees[1]._id }],
      },
      {
        name: "Operations Team",
        leader: employees[3]._id,
        company: company._id,
        members: [{ employee: employees[3]._id }],
      },
    ]);

    // Create Equipment
    console.log("⚙️  Creating equipment...");
    await Equipment.insertMany([
      {
        name: "CNC Machine #1",
        equipmentCode: "EQ-0001",
        category: "Machinery",
        company: company._id,
        location: locations[0]._id,
        workCenter: workCenters[0]._id,
        status: "operational",
        priority: "high",
        manufacturer: "Haas",
        model: "VF-2",
      },
      {
        name: "Conveyor Belt A",
        equipmentCode: "EQ-0002",
        category: "Conveyor Systems",
        company: company._id,
        location: locations[1]._id,
        workCenter: workCenters[2]._id,
        status: "operational",
        priority: "medium",
      },
      {
        name: "Welding Robot",
        equipmentCode: "EQ-0003",
        category: "Robotics",
        company: company._id,
        location: locations[0]._id,
        workCenter: workCenters[1]._id,
        status: "maintenance",
        priority: "high",
        manufacturer: "Fanuc",
      },
      {
        name: "Forklift #1",
        equipmentCode: "EQ-0004",
        category: "Vehicles",
        company: company._id,
        location: locations[3]._id,
        workCenter: workCenters[3]._id,
        status: "operational",
        priority: "medium",
      },
      {
        name: "HVAC Unit - Main",
        equipmentCode: "EQ-0005",
        category: "HVAC",
        company: company._id,
        location: locations[0]._id,
        status: "operational",
        priority: "low",
      },
    ]);

    // Create Notifications for admin
    console.log("🔔 Creating notifications...");
    await Notification.insertMany([
      {
        user: adminUser._id,
        title: "Maintenance Due",
        message: "Equipment #123 maintenance is due tomorrow",
        type: "warning",
        isRead: false,
      },
      {
        user: adminUser._id,
        title: "Task Completed",
        message: "John completed the HVAC inspection",
        type: "success",
        isRead: false,
      },
      {
        user: adminUser._id,
        title: "New Work Order",
        message: "New work order #WO-456 created",
        type: "info",
        isRead: false,
      },
      {
        user: adminUser._id,
        title: "Equipment Alert",
        message: "Welding Robot showing unusual patterns",
        type: "warning",
        isRead: false,
      },
      {
        user: adminUser._id,
        title: "System Update",
        message: "Scheduled maintenance window tonight",
        type: "info",
        isRead: true,
      },
    ]);

    console.log("\n✅ Seed completed successfully!");
    console.log("📧 Admin Login: admin@gearguard.com / admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedData();
