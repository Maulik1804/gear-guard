# Database Tables Explained in Simple Terms

Think of these tables like different filing cabinets in an office. Each one stores specific information.

---

## 🔐 **1. AUTHENTICATION & USER MANAGEMENT**

### `companies`
**What it is:** A list of all companies/organizations using the system
**Example:** "My Company (Our Tracker)", "ABC Corp", "XYZ Industries"
**Think of it as:** The company directory

### `users`
**What it is:** All the people who can log into the system
**Stores:** Name, email, password, which company they belong to
**Example:** John Doe (john@company.com), Jane Smith (jane@company.com)
**Think of it as:** The login credentials file

---

## 👥 **2. EMPLOYEE & TEAM MANAGEMENT**

### `employees`
**What it is:** Detailed info about each employee (beyond just login)
**Stores:** Employee code, department, position, which company
**Example:** Employee #12345, John Doe, IT Department, Manager
**Think of it as:** The employee HR file

### `teams`
**What it is:** Groups of employees working together
**Stores:** Team name, who's the team leader, which company
**Example:** "Support Team" led by John, "Sales Team" led by Jane
**Think of it as:** The team roster

### `team_members`
**What it is:** Which employees belong to which teams
**Example:** John is in Support Team, Jane is in Sales Team
**Think of it as:** The team membership list

---

## 📍 **3. LOCATION & WORK CENTER**

### `locations`
**What it is:** Physical places where equipment is located
**Stores:** Location name, address
**Example:** "Building A - Floor 3", "Warehouse B", "Office Main"
**Think of it as:** The address book for equipment locations

### `work_centers`
**What it is:** Departments or areas where work gets done
**Stores:** Work center name, work center group
**Example:** "Assembly Line 1", "Quality Control", "Packaging"
**Think of it as:** The work area directory

---

## 📦 **4. EQUIPMENT CATEGORIES & TYPES**

### `equipment_categories`
**What it is:** Types/categories to organize equipment
**Stores:** Category name, who's responsible for it, which company
**Example:** "Asset", "Finance", "Database", "Servers"
**Think of it as:** The equipment filing system labels

### `maintenance_types`
**What it is:** Different kinds of maintenance work
**Stores:** Maintenance type name, description
**Example:** "Preventive", "Corrective", "Emergency", "Routine"
**Think of it as:** The maintenance job types list

---

## 🛠️ **5. EQUIPMENT/COMPONENT MANAGEMENT**

### `equipment`
**What it is:** THE MAIN TABLE - All your equipment/machines/components
**Stores:** 
- Equipment name (e.g., "Assembly Machine 1")
- Type/Model (e.g., "Model XYZ-2024")
- Which category it belongs to
- Who uses it
- Where it's located
- What kind of maintenance it needs
- When it was assigned, when it stops being used
- Description and status

**Example:** 
- "Server Rack A" - Database category - Used by IT team - Located in Server Room - Needs Preventive Maintenance

**Think of it as:** The master equipment inventory list

---

## 📋 **6. WORK ORDER MANAGEMENT**

### `work_orders`
**What it is:** Official work requests/jobs that need to be done
**Stores:**
- Work order number (like a ticket ID)
- Cost, cost per hour
- Tag/label
- Capacity estimates
- Goal/target
- Which work center handles it
- Which equipment it's for
- Start and end dates
- Status (draft, in_progress, completed)

**Example:**
- Work Order #WO-001 - Fix Server Rack A - Cost: $500 - Assigned to IT Work Center - Due: Jan 15, 2024

**Think of it as:** The work request/job ticket system

---

## ✅ **7. TASK MANAGEMENT**

### `task_types`
**What it is:** Different kinds of tasks you can create
**Stores:** Task type name
**Example:** "Inspection", "Repair", "Installation", "Cleaning"
**Think of it as:** The task category list

### `tasks`
**What it is:** Individual tasks/activities that need to be done
**Stores:**
- Task name/activity
- What type of task
- Subject/apartment (where it applies)
- Who it's assigned to
- When it's scheduled
- Where it happens
- Priority level (low, medium, high, urgent)
- What kind of maintenance
- Description
- Optional link to a work order
- Status

**Example:**
- Task: "Replace filter in AC Unit 5" - Type: Repair - Assigned to: John - Priority: High - Location: Building A Floor 2 - Scheduled: Jan 10, 2024

**Think of it as:** The to-do list for maintenance work

---

## 📅 **8. MAINTENANCE SCHEDULE**

### `maintenance_schedules`
**What it is:** The calendar/schedule showing when maintenance happens
**Stores:**
- Which equipment
- Which task
- Which work order (if any)
- Scheduled date and time
- How long it will take
- Who's assigned to do it
- Status (scheduled, in_progress, completed, overdue)
- Notes

**Example:**
- Schedule Entry: Server Rack A - Task: Monthly Check - Date: Jan 15, 2024 at 2:00 PM - Duration: 2 hours - Assigned to: John

**Think of it as:** The maintenance calendar/Gantt chart

---

## 🔗 **9. RELATIONSHIPS**

### `work_order_tasks`
**What it is:** Links work orders to their related tasks
**Why:** One work order can have multiple tasks, and one task can be part of multiple work orders
**Example:** Work Order #WO-001 has Task "Check wiring" and Task "Test system"
**Think of it as:** The connector that ties work orders and tasks together

---

## 🎯 **How They Work Together - Simple Flow:**

1. **Company** signs up → Creates **Users** → Users become **Employees**
2. **Employees** form **Teams** with **Team Leaders**
3. Company has **Locations** and **Work Centers**
4. Equipment is organized into **Categories** and **Maintenance Types**
5. **Equipment** is registered with all its details
6. When something needs fixing → Create a **Work Order**
7. Break down the work into **Tasks** and assign to **Employees**
8. Schedule everything in **Maintenance Schedule** calendar
9. Track progress and completion

**Real Example:**
- Company: "ABC Corp"
- Employee: John (IT Manager)
- Team: "IT Support Team" (John is leader)
- Location: "Server Room"
- Equipment: "Database Server 1" (Category: Database, Maintenance Type: Preventive)
- Work Order: "WO-001: Monthly Server Maintenance"
- Tasks: "Check logs", "Update software", "Backup data"
- Schedule: All scheduled for Jan 15, 2024

---

## 💡 **Quick Reference:**

| Table | Purpose | Like... |
|-------|---------|---------|
| `companies` | Organizations | Company directory |
| `users` | Login accounts | User credentials |
| `employees` | Staff details | HR file |
| `teams` | Work groups | Team roster |
| `locations` | Physical places | Address book |
| `work_centers` | Work areas | Department list |
| `equipment_categories` | Equipment types | Filing labels |
| `maintenance_types` | Maintenance kinds | Job types |
| `equipment` | All equipment | Master inventory |
| `work_orders` | Work requests | Job tickets |
| `tasks` | Individual tasks | To-do list |
| `maintenance_schedules` | Calendar | Schedule book |
| `work_order_tasks` | Links | Connector table |

