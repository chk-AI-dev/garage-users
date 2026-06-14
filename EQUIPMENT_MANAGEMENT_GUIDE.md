# Equipment Management System - Implementation Guide


## Overview
The Equipment Management System has been fully implemented for the Mining Operations Management application. It provides comprehensive CRUD functionality for managing mining equipment, including features like operator assignment, maintenance tracking, and real-time status updates.

## What Was Implemented


### 1. Backend Components


#### Equipment Model (`/backend/src/models/equipments.js`)
**Purpose**: Defines the MongoDB schema for equipment storage


**Key Fields**:
- `equipmentId`: Unique identifier (e.g., "EX-01", "TP-01") - required, unique, uppercase
- `type`: Equipment type enum - Excavator, Tipper, Dozer, Grader, Diesel Bowser, Crane, Loader, Other
- `status`: Current status enum - Working, In Maintenance, Out of Service, Inactive
- `capacity`: Equipment capacity (e.g., "2.5 Cum", "20 Ton")
- `assignedArea`: Geographic area assignment (e.g., "Pit A", "Route", "Site B")
- `operator`: Reference to User model (operator/driver assigned)
- `purchaseDate`: Equipment acquisition date
- `registrationNumber`: Vehicle registration number
- `lastMaintenanceDate`: Last maintenance performed
- `nextMaintenanceDate`: Next scheduled maintenance
- `notes`: Additional notes and remarks
- `createdBy`: User who created the record (audit trail)
- `updatedBy`: User who last modified the record (audit trail)
- Timestamps: `createdAt`, `updatedAt` for change tracking

**Database Indexes**:
- equipmentId (unique)
- type (for filtering)
- status (for filtering)

#### Equipment Controller (`/backend/src/controllers/equipmentController.js`)
**Purpose**: Handles all business logic for equipment operations

**Implemented Methods**:
1. **getAllEquipment**: List all equipment with pagination, filtering, and search
   - Supports filtering by: type, status, assignedArea
   - Supports searching by: equipmentId, type, registrationNumber
   - Pagination: 10 items per page by default
   - Populated relationships with operator and audit user details

2. **getEquipment**: Retrieve single equipment by MongoDB ID

3. **getEquipmentByEquipmentId**: Retrieve equipment by custom Equipment ID

4. **createEquipment**: Create new equipment
   - Validates unique equipmentId
   - Validates operator exists if provided
   - Tracks createdBy for audit trail

5. **updateEquipment**: Update existing equipment
   - Checks equipmentId uniqueness if changed
   - Validates operator relationship
   - Tracks updatedBy for audit trail

6. **deleteEquipment**: Soft/hard delete equipment

7. **updateEquipmentStatus**: Change equipment status
   - Validates status enum
   - Tracks who made the change

8. **assignOperator**: Assign or change operator assignment
   - Validates operator exists
   - Validates operator has correct role (operator/driver)

9. **getEquipmentStats**: Dashboard statistics
   - Total equipment count
   - Count by status (Working, In Maintenance, Out of Service, Inactive)
   - Equipment breakdown by type
   - Equipment distribution by assigned area

#### Equipment Routes (`/backend/src/routes/equipmentRoutes.js`)
**Purpose**: RESTful API endpoints for equipment management

**API Endpoints**:

| Method | Endpoint | Requires | Description |
|--------|----------|----------|-------------|
| GET | `/api/equipment` | authenticate, authorize(admin, supervisor) | List all equipment with filters |
| GET | `/api/equipment/:id` | authenticate, authorize(admin, supervisor) | Get single equipment by ID |
| GET | `/api/equipment/equipment-id/:equipmentId` | authenticate, authorize(admin, supervisor) | Get equipment by Equipment ID |
| GET | `/api/equipment/stats/overview` | authenticate, authorize(admin, supervisor) | Get equipment statistics |
| POST | `/api/equipment` | authenticate, authorize(admin) | Create new equipment |
| PUT | `/api/equipment/:id` | authenticate, authorize(admin) | Update equipment details |
| PUT | `/api/equipment/:id/status` | authenticate, authorize(admin) | Update equipment status |
| PUT | `/api/equipment/:id/assign-operator` | authenticate, authorize(admin) | Assign operator to equipment |
| DELETE | `/api/equipment/:id` | authenticate, authorize(admin) | Delete equipment |

**Query Parameters** (for list endpoint):
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `type`: Filter by equipment type
- `status`: Filter by equipment status
- `assignedArea`: Filter by assigned area
- `search`: Search term (searches equipmentId, type, registrationNumber)

### 2. Frontend Components

#### API Client (`/frontend/src/utils/equipmentApi.js`)
**Purpose**: Provides methods to call backend equipment endpoints

**Available Methods**:
```javascript
equipmentApi.getAllEquipment(page, limit, filters)
equipmentApi.getEquipmentById(id)
equipmentApi.getEquipmentByEquipmentId(equipmentId)
equipmentApi.createEquipment(equipmentData)
equipmentApi.updateEquipment(id, equipmentData)
equipmentApi.updateEquipmentStatus(id, status)
equipmentApi.assignOperator(id, operatorId)
equipmentApi.deleteEquipment(id)
equipmentApi.getEquipmentStats()
```

#### Equipment Management Page (`/frontend/src/pages/EquipmentManagement.jsx`)
**Purpose**: Full CRUD interface for equipment management

**Features**:
1. **Equipment List Table**
   - Displays: ID, Type, Status, Capacity, Assigned Area, Operator, Registration Number
   - Sortable and searchable
   - Responsive design for mobile/tablet/desktop

2. **Search & Filtering**
   - Search by: Equipment ID, Type, Registration Number
   - Filter by: Type, Status, Assigned Area
   - Real-time filter updates

3. **Status Dropdown**
   - Inline status change from table
   - Color-coded badges:
     - Green: Working
     - Yellow/Orange: In Maintenance
     - Red: Out of Service
     - Gray: Inactive

4. **CRUD Operations**
   - **Create**: "Add Equipment" button opens modal with form
   - **Read**: Table view with populated relationships
   - **Update**: Edit button opens modal pre-populated with existing data
   - **Delete**: Confirmation dialog before deletion

5. **Modal Form Fields**
   - Equipment ID (disabled on edit)
   - Type dropdown
   - Status dropdown
   - Capacity text input
   - Assigned Area text input
   - Operator dropdown (fetches from database)
   - Registration Number
   - Purchase Date picker
   - Notes textarea

6. **Pagination**
   - Previous/Next buttons
   - Page indicator showing current page and total pages
   - 10 items per page

7. **Responsive Design**
   - Mobile: Stacked layout, single-column form
   - Tablet: Adjusted spacing, flexible grid
   - Desktop: Full-width table with multi-column form

#### Equipment Management Styling (`/frontend/src/pages/EquipmentManagement.css`)
**Purpose**: Professional styling with dark mode support

**Key Features**:
- Mining-themed color scheme (Primary Blue #1e40af, Accent Gold #f59e0b)
- Dark mode support with CSS variables
- Gradient headers and buttons
- Smooth transitions and animations
- Responsive breakpoints (480px, 768px, 1024px, 1400px)
- Professional table styling with hover effects
- Modal animations
- Badge color coding by status

### 3. Integration Points

#### Admin Dashboard Enhancement
- Added "Equipment" button to admin header
- Quick navigation to equipment management
- Clickable from main admin dashboard

#### App Routing (`/frontend/src/App.jsx`)
- Added route: `/admin/equipment`
- Protected by admin/supervisor authorization
- Integrated with existing authentication system

#### Admin Dashboard Styling (`/frontend/src/pages/AdminDashboard.css`)
- Added `.admin-actions` class for multi-button layout
- Responsive button arrangement

## How to Use

### As an Admin/Supervisor

1. **Navigate to Equipment Management**
   - Go to Admin Dashboard
   - Click "Equipment" button in header

2. **Viewing Equipment**
   - All equipment displays in table format
   - Use search bar to find specific equipment
   - Apply filters by Type, Status, or Area

3. **Adding Equipment**
   - Click "Add Equipment" button
   - Fill in required fields (Equipment ID, Type, Status, Capacity, Area)
   - Optionally assign operator and add purchase date
   - Click "Add Equipment" to save

4. **Updating Equipment**
   - Click Edit (pencil icon) on any equipment row
   - Modify fields as needed
   - Equipment ID cannot be changed
   - Click "Update Equipment" to save

5. **Changing Status**
   - Click status dropdown in table for any equipment
   - Select new status (Working, In Maintenance, Out of Service, Inactive)
   - Status updates immediately

6. **Assigning Operator**
   - Click Edit on equipment
   - Select operator from dropdown
   - Save changes

7. **Deleting Equipment**
   - Click Delete (trash icon)
   - Confirm deletion in popup
   - Equipment is removed

### API Request Examples

#### List Equipment
```bash
GET /api/equipment?page=1&limit=10&status=Working&type=Excavator
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 3,
  "equipment": [
    {
      "_id": "ObjectId",
      "equipmentId": "EX-01",
      "type": "Excavator",
      "status": "Working",
      "capacity": "2.5 Cum",
      "assignedArea": "Pit A",
      "operator": {
        "_id": "ObjectId",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Create Equipment
```bash
POST /api/equipment
Authorization: Bearer {token}
Content-Type: application/json

{
  "equipmentId": "EX-02",
  "type": "Excavator",
  "status": "Working",
  "capacity": "3.0 Cum",
  "assignedArea": "Pit B",
  "operator": "operator_user_id",
  "registrationNumber": "HR-01-AB-1234",
  "purchaseDate": "2023-01-01",
  "notes": "Recently serviced"
}
```

#### Update Equipment Status
```bash
PUT /api/equipment/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "In Maintenance"
}
```

## Database Considerations

### Indexes for Performance
Equipment queries are optimized with indexes on:
- `equipmentId` (unique, used for rapid lookups)
- `type` (used for filtering queries)
- `status` (used for status-based filtering)

### Relationships
- Equipment → User (operator): Optional reference to assigned operator
- Equipment → User (createdBy/updatedBy): Audit trail showing who modified
- Multiple operators can be assigned over time (through update history)

## Error Handling

### Common Error Responses

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "param": "equipmentId",
      "msg": "Equipment ID is required"
    }
  ]
}
```

**400 Bad Request - Duplicate Equipment ID**
```json
{
  "success": false,
  "message": "Equipment with ID EX-01 already exists"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Equipment not found"
}
```

**403 Forbidden - Insufficient Permissions**
```json
{
  "success": false,
  "message": "Insufficient permissions for this action"
}
```

## Testing Checklist

- [ ] Can create equipment with all required fields
- [ ] Equipment ID validation prevents duplicates
- [ ] Can update equipment details
- [ ] Can change equipment status
- [ ] Can assign/change operator
- [ ] Can delete equipment
- [ ] Search works for ID, Type, Registration Number
- [ ] Filters work for Type, Status, Area
- [ ] Pagination works correctly
- [ ] Status changes reflect immediately in table
- [ ] Dark mode displays correctly
- [ ] Mobile responsive layout works
- [ ] Operator dropdown shows available operators
- [ ] Date fields work correctly
- [ ] Modal form validation works

## Configuration

### Environment Variables (Already Set)
- `VITE_API_URL`: http://localhost:5001/api
- `VITE_SERVER_URL`: http://localhost:5001

### Database Connection
Equipment data is stored in MongoDB collection: `equipments`

## Troubleshooting

### Equipment not appearing in list
- Check MongoDB connection in backend
- Verify equipment route is registered in server.js
- Check user has admin/supervisor role

### Operator dropdown empty
- Verify operators exist in User collection
- Check operator users have role: 'operator'
- Frontend makes call to getAllUsers with role filter

### Status update not working
- Verify user is admin (required for PUT requests)
- Check new status is valid enum value
- Look for validation errors in console

## Future Enhancement Opportunities

1. **Bulk Operations**
   - Bulk status updates
   - Bulk equipment import/export (CSV)

2. **Maintenance Tracking**
   - Maintenance history timeline
   - Automated maintenance notifications
   - Maintenance cost tracking

3. **Advanced Analytics**
   - Equipment utilization reports
   - Operating cost reports
   - Maintenance cost analysis

4. **Mobile App**
   - Field operator app for status updates
   - Real-time equipment location tracking

5. **Integrations**
   - GPS tracking integration
   - IoT sensor data integration
   - Automated alerts for maintenance

## File Structure Summary

```
Backend:
├── /backend/src/models/equipments.js          [Equipment Schema]
├── /backend/src/controllers/equipmentController.js  [CRUD Logic]
├── /backend/src/routes/equipmentRoutes.js    [API Endpoints]
└── /backend/src/server.js                    [Routes Registration]

Frontend:
├── /frontend/src/utils/equipmentApi.js       [API Client]
├── /frontend/src/pages/EquipmentManagement.jsx  [UI Component]
├── /frontend/src/pages/EquipmentManagement.css  [Styling]
├── /frontend/src/pages/AdminDashboard.jsx    [Navigation Link]
├── /frontend/src/pages/AdminDashboard.css    [Layout Updates]
└── /frontend/src/App.jsx                     [Route Registration]
```

## Support & Documentation

For API documentation, refer to the Equipment Routes file.
For UI customization, modify EquipmentManagement.css using CSS variables defined in global.css.
For business logic changes, update equipmentController.js methods.

---

**Implementation Date**: 2024
**Version**: 1.0
**Status**: Production Ready
