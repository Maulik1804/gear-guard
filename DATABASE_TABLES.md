# GearGuard Database Tables

Based on the workflow diagram, here are all the database tables you need:

## Core Tables (11 Main Categories)

### 1. **Authentication & User Management**
- **`users`** - User accounts (email, password, name, role)
- **`companies`** - Company/organization information

### 2. **Employee & Team Management**
- **`employees`** - Employee information linked to users
- **`teams`** - Team definitions with team leaders
- **`team_members`** - Many-to-many relationship between teams and employees

### 3. **Location & Work Center**
- **`locations`** - Physical locations where equipment is used
- **`work_centers`** - Work center groups for work order management

### 4. **Equipment Categories & Types**
- **`equipment_categories`** - Categories for organizing equipment (Asset, Finance, Database, Servers, etc.)
- **`maintenance_types`** - Types of maintenance operations

### 5. **Equipment/Component Management**
- **`equipment`** - Main equipment/component table with all details:
  - Equipment name, type/model
  - Category, company, location
  - Assigned employee, dates
  - Maintenance type, description

### 6. **Work Order Management**
- **`work_orders`** - Work orders with:
  - Cost, tag, alternative information
  - Cost per hour, capacity/task estimates
  - Goal/target, work center
  - Dates, status

### 7. **Task Management**
- **`task_types`** - Types of tasks
- **`tasks`** - Task activities with:
  - Subject/apartment, assigned employee
  - Schedule date, location, priority
  - Maintenance type, description
  - Optional link to work order

### 8. **Maintenance Schedule**
- **`maintenance_schedules`** - Calendar/schedule entries linking:
  - Equipment, tasks, work orders
  - Scheduled dates/times
  - Assigned employees
  - Status tracking

### 9. **Relationships**
- **`work_order_tasks`** - Links work orders to tasks (many-to-many)

## Key Relationships

```
Companies
  ├── Users
  ├── Employees
  ├── Teams (with Team Leaders)
  ├── Equipment Categories
  ├── Equipment
  │   ├── Equipment Category
  │   ├── Location
  │   ├── Employee (Used By)
  │   └── Maintenance Type
  ├── Work Orders
  │   ├── Equipment
  │   ├── Work Center
  │   └── Tasks (via work_order_tasks)
  ├── Tasks
  │   ├── Employee (Assigned To)
  │   ├── Location
  │   ├── Maintenance Type
  │   └── Work Order (optional)
  └── Maintenance Schedules
      ├── Equipment
      ├── Tasks
      └── Work Orders
```

## Important Notes from Workflow

1. **Work Order Validation**: Work orders require matching work center group, date, and task fields
2. **Conditional Fields**: When a work order is selected in a task, the work order field becomes visible
3. **Equipment Categories**: Have responsible employees assigned
4. **Teams**: Have team leaders who are employees
5. **Maintenance Schedule**: Provides full calendar/Gantt view of all maintenance activities

## Database File

The complete SQL schema is available in `database_schema.sql` with:
- All table definitions
- Foreign key relationships
- Indexes for performance
- Sample data insertion

