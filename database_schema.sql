-- GearGuard: The Ultimate Maintenance Tracker
-- Database Schema

-- ============================================
-- 0. CREATE DATABASE
-- ============================================

-- Create the database (run this first, then connect to it)
-- Note: In PostgreSQL, you need to connect to 'postgres' database first to create a new database
-- psql -U postgres -c "CREATE DATABASE gear_guard;"
-- Then connect to the new database: psql -U postgres -d gear_guard

-- For PostgreSQL (if running from psql connected to postgres database):
CREATE DATABASE gear_guard;

-- After creating the database, connect to it:
-- \c gear_guard

-- ============================================
-- 1. COMPANY MANAGEMENT (Must be created first)
-- ============================================

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. AUTHENTICATION & USER MANAGEMENT
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. EMPLOYEE & TEAM MANAGEMENT
-- ============================================

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    employee_code VARCHAR(100) UNIQUE,
    company_id INTEGER REFERENCES companies(id),
    department VARCHAR(100),
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    team_leader_id INTEGER REFERENCES employees(id),
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    employee_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. LOCATION & WORK CENTER MANAGEMENT
-- ============================================

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE work_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    work_center_group VARCHAR(255),
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. EQUIPMENT CATEGORIES & TYPES
-- ============================================

CREATE TABLE equipment_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    responsible_id INTEGER REFERENCES employees(id),
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. EQUIPMENT/COMPONENT MANAGEMENT
-- ============================================

CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    type_model VARCHAR(255),
    equipment_category_id INTEGER REFERENCES equipment_categories(id),
    company_id INTEGER REFERENCES companies(id),
    used_by_id INTEGER REFERENCES employees(id),
    used_in_location_id INTEGER REFERENCES locations(id),
    maintenance_type_id INTEGER REFERENCES maintenance_types(id),
    assigned_date DATE,
    stop_date DATE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, maintenance, retired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. WORK ORDER MANAGEMENT
-- ============================================

CREATE TABLE work_orders (
    id SERIAL PRIMARY KEY,
    work_order_number VARCHAR(100) UNIQUE NOT NULL,
    cost DECIMAL(10, 2),
    tag VARCHAR(100),
    alternative_information TEXT,
    cost_per_hour DECIMAL(10, 2),
    capacity_task_estimate DECIMAL(10, 2),
    goal_target VARCHAR(255),
    work_center_id INTEGER REFERENCES work_centers(id),
    equipment_id INTEGER REFERENCES equipment(id),
    from_date DATE,
    to_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, in_progress, completed, cancelled
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. TASK MANAGEMENT
-- ============================================

CREATE TABLE task_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_activity VARCHAR(255) NOT NULL,
    type_id INTEGER REFERENCES task_types(id),
    subject_apartment VARCHAR(255),
    assigned_to_id INTEGER REFERENCES employees(id),
    schedule_date DATE,
    location_id INTEGER REFERENCES locations(id),
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent
    maintenance_type_id INTEGER REFERENCES maintenance_types(id),
    description TEXT,
    work_order_id INTEGER REFERENCES work_orders(id), -- Optional: if task is linked to work order
    request_created_for_new_type BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. MAINTENANCE SCHEDULE
-- ============================================

CREATE TABLE maintenance_schedules (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id),
    task_id INTEGER REFERENCES tasks(id),
    work_order_id INTEGER REFERENCES work_orders(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    duration_hours DECIMAL(5, 2),
    assigned_to_id INTEGER REFERENCES employees(id),
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled, overdue
    notes TEXT,
    company_id INTEGER REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. WORK ORDER TASKS RELATIONSHIP
-- ============================================

CREATE TABLE work_order_tasks (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER REFERENCES work_orders(id),
    task_id INTEGER REFERENCES tasks(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 11. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_equipment_company ON equipment(company_id);
CREATE INDEX idx_equipment_category ON equipment(equipment_category_id);
CREATE INDEX idx_work_orders_equipment ON work_orders(equipment_id);
CREATE INDEX idx_work_orders_work_center ON work_orders(work_center_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_work_order ON tasks(work_order_id);
CREATE INDEX idx_maintenance_schedules_date ON maintenance_schedules(scheduled_date);
CREATE INDEX idx_maintenance_schedules_equipment ON maintenance_schedules(equipment_id);

-- ============================================
-- 12. SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a default company
INSERT INTO companies (name) VALUES ('My Company (Our Tracker)');

