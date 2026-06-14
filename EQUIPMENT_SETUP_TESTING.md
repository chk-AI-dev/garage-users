# Equipment Management - Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running (local or cloud)
- Backend server on http://localhost:5001
- Frontend development server on http://localhost:3000


## Backend Setup


### 1. Install Dependencies (if not already done)
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create/verify `.env` file in `/backend` with:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/garage-users
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend Server
```bash
npm start
# or
node src/server.js
```

Expected output:
```
✓ MongoDB connected
✓ Server running on http://localhost:5001
```

## Frontend Setup

### 1. Install Dependencies (if not already done)
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Verify `.env` file has:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SERVER_URL=http://localhost:5001
VITE_APP_NAME=Garage Users
```

### 3. Start Frontend Server
```bash
npm run dev
```

Access at: http://localhost:3000

## Testing the Implementation

### Step 1: Login to Admin Account
1. Navigate to http://localhost:3000/login
2. Use admin credentials (created during registration)
3. You should be redirected to /dashboard

### Step 2: Navigate to Equipment Management
1. Click on "Admin" in header
2. You should see Admin Dashboard
3. Click "Equipment" button to go to Equipment Management
4. Or navigate directly to: http://localhost:3000/admin/equipment

### Step 3: Test CRUD Operations

#### Create Equipment
1. Click "Add Equipment" button
2. Fill in form:
   - Equipment ID: `EX-01`
   - Type: `Excavator`
   - Status: `Working`
   - Capacity: `2.5 Cum`
   - Assigned Area: `Pit A`
   - Operator: (optional - select from dropdown)
   - Registration: `HR-01-AB-1234`
3. Click "Add Equipment"
4. Should see success toast notification and equipment appears in table

#### Read Equipment
1. Equipment list displays automatically
2. Search/filter as needed:
   - Search: Type equipment ID (e.g., "EX-01")
   - Filter Type: Select equipment type
   - Filter Status: Select status
   - Filter Area: Type area name
3. Click "Next/Previous" for pagination

#### Update Equipment
1. Click Edit (pencil icon) on any equipment
2. Modal opens with pre-filled data
3. Modify desired fields (Equipment ID is read-only)
4. Click "Update Equipment"
5. Should see success notification and table updates

#### Delete Equipment
1. Click Delete (trash icon) on any equipment
2. Confirm deletion
3. Equipment should be removed from list

#### Change Status
1. In equipment table, click Status dropdown
2. Select new status
3. Should update immediately with color change

### Step 4: Test Search and Filters
1. Type in search box (searches ID, Type, Registration)
2. Select Type filter
3. Select Status filter
4. Filter by Assigned Area
5. Verify results update correctly
6. Clear filters to see all equipment

### Step 5: Test Pagination
1. Create multiple equipment (10+)
2. Check pagination buttons appear
3. Navigate through pages
4. Verify correct items display per page

### Step 6: Test Responsive Design
1. Open browser DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test at different breakpoints:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)
4. Verify layout is responsive and functional

### Step 7: Test Dark Mode
1. Click dark mode toggle in header
2. Equipment management page should switch to dark mode
3. Colors should be readable in both modes
4. Settings should persist on page reload

## API Testing with cURL

### Get All Equipment
```bash
curl -X GET "http://localhost:5001/api/equipment?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Equipment
```bash
curl -X POST "http://localhost:5001/api/equipment" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "equipmentId": "EX-01",
    "type": "Excavator",
    "status": "Working",
    "capacity": "2.5 Cum",
    "assignedArea": "Pit A",
    "registrationNumber": "HR-01-AB-1234"
  }'
```

### Update Equipment Status
```bash
curl -X PUT "http://localhost:5001/api/equipment/{EQUIPMENT_ID}/status" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Maintenance"
  }'
```

### Get Equipment Stats
```bash
curl -X GET "http://localhost:5001/api/equipment/stats/overview" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Known Test Data

Common equipment types to test with:
- `Excavator` (EX-01, EX-02, etc.)
- `Tipper` (TP-01, TP-02, etc.)
- `Dozer` (DZ-01, DZ-02, etc.)
- `Grader` (GR-01, GR-02, etc.)
- `Diesel Bowser` (DB-01, DB-02, etc.)
- `Crane` (CR-01, CR-02, etc.)
- `Loader` (LD-01, LD-02, etc.)

Status values:
- `Working` (green badge)
- `In Maintenance` (yellow badge)
- `Out of Service` (red badge)
- `Inactive` (gray badge)

## Troubleshooting

### Equipment Page Shows 404
- Check if admin/supervisor is logged in
- Check browser console for errors
- Verify backend is running on :5001

### Equipment Not Appearing in List
- Check MongoDB is running
- Check Backend console for connection errors
- Verify equipment routes are registered in server.js

### Can't Assign Operator
- Operator user must exist in database
- Operator must have role: 'operator' or 'driver'
- Try creating an operator user first

### Buttons Not Working / Slow Response
- Check Network tab in DevTools
- Check Backend console for errors
- Verify JWT token is valid (check localStorage)
- Check MongoDB connection

### Dark Mode Not Working
- Clear browser cache and localStorage
- Check Header component is rendering
- Check CSS variables are defined in global.css

### Search/Filter Not Working
- Check query parameters in Network tab
- Verify MongoDB indexes exist
- Check backend console for query errors

## Performance Testing

### Test Large Dataset
```bash
# Create 100 equipment entries
for i in {1..100}; do
  curl -X POST "http://localhost:5001/api/equipment" \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"equipmentId\": \"EQ-$i\", \"type\": \"Excavator\", \"status\": \"Working\", \"capacity\": \"2.5 Cum\", \"assignedArea\": \"Site\"}"
done
```

Then test:
- List loading time (should be < 1 second)
- Search performance (should be instant)
- Pagination navigation (should be smooth)

## Monitoring

### Check Backend Health
```bash
curl http://localhost:5001/api/health
# Response: {"status": "Server is running"}
```

### Monitor Backend Logs
Watch terminal where backend runs for:
- Connection logs
- Request logs
- Error messages

### Monitor Frontend Logs
Open browser DevTools Console (F12) to see:
- Network requests
- JavaScript errors
- Component render warnings

## Next Steps

After verifying Equipment Management works:

1. **Create Test Data**
   - Add 10-20 equipment items
   - Assign different operators
   - Set various statuses

2. **Train Users**
   - Show admin how to add equipment
   - Show how to assign operators
   - Explain status meanings

3. **Integrate with Other Features**
   - Link equipment to work orders (future)
   - Link to maintenance logs (future)
   - Create equipment reports (future)

4. **Production Deployment**
   - Set production environment variables
   - Enable SSL certificate
   - Set up database backups
   - Configure monitoring/alerts

## Support

For issues or questions:
1. Check EQUIPMENT_MANAGEMENT_GUIDE.md for detailed docs
2. Review error messages in browser console
3. Check backend server logs
4. Verify database connection and data

---

**Quick Test Checklist**:
- [ ] Backend server starts without errors
- [ ] Frontend can access equipment page
- [ ] Can create new equipment
- [ ] Can view equipment list
- [ ] Can update equipment
- [ ] Can change status
- [ ] Can delete equipment
- [ ] Search works
- [ ] Filters work
- [ ] Dark mode works
- [ ] Mobile layout responsive
- [ ] No console errors

**Test Complete!** ✓ Equipment Management System is ready to use.
