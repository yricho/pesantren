# User Manual - Pondok Imam Syafi'i Blitar Management System

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Financial Management](#financial-management)
4. [Activity Management](#activity-management)
5. [Course Management](#course-management)
6. [Video Management](#video-management)
7. [User Management](#user-management)
8. [Offline Features](#offline-features)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection**: Required for initial login and data sync
- **JavaScript**: Must be enabled
- **Screen Resolution**: Minimum 1024x768 (responsive design supports all sizes)

### First Time Access

#### Logging In
1. Open your web browser and navigate to the application URL
2. You will see the login screen with the Pondok Imam Syafi'i Blitar logo
3. Enter your username and password
4. Click "Sign In" or press Enter
5. If credentials are correct, you will be redirected to the dashboard

#### Account Types
- **Administrator**: Full access to all features including user management
- **Staff**: Access to daily operations (transactions, activities, courses, videos)

#### Forgot Password
Contact your system administrator to reset your password. For security reasons, password reset must be done manually.

### Navigation

#### Main Menu
The main navigation menu is located on the left side (desktop) or in a collapsible menu (mobile):
- **Dashboard**: Overview of all activities and statistics
- **Transactions**: Income, expenses, and donations management
- **Activities**: Event and activity planning
- **Courses**: Educational program management
- **Videos**: Educational video library
- **Users** (Admin only): User account management

#### User Profile Menu
Click on your name/avatar in the top right corner to:
- View profile information
- Change password
- Sign out

## Dashboard Overview

### Main Statistics
The dashboard displays key metrics:
- **Total Students**: Current number of enrolled students
- **Monthly Income**: Total income for current month
- **Monthly Expenses**: Total expenses for current month
- **Total Donations**: Accumulated donations
- **Upcoming Activities**: Number of planned activities
- **Active Courses**: Currently running courses

### Recent Activity Feed
Shows the latest:
- Financial transactions
- Activity updates
- Course enrollments
- Video uploads

### Quick Actions
- Add new transaction
- Create activity
- Register new course
- Upload video content

## Financial Management

### Overview
The financial module helps track income, expenses, and donations for the pondok.

### Adding Transactions

#### Income Transaction
1. Navigate to "Transactions" in the main menu
2. Click "Add Transaction" button
3. Select transaction type: "Income"
4. Fill in required fields:
   - **Category**: Select appropriate category (Tuition, Donation, etc.)
   - **Amount**: Enter amount in Indonesian Rupiah
   - **Description**: Describe the income source
   - **Date**: Select transaction date
5. Click "Save Transaction"

#### Expense Transaction
1. Follow same steps as income
2. Select transaction type: "Expense"
3. Categories include: Food, Utilities, Maintenance, etc.
4. Amount will automatically be treated as negative

#### Donation Transaction
1. Similar process to income and expense
2. Select transaction type: "Donation"
3. Special tracking for Zakat and Sadaqah

### Viewing Transactions
- **List View**: See all transactions in chronological order
- **Filter Options**: Filter by type, category, date range
- **Search**: Search by description or amount
- **Export**: Download transaction data as Excel/PDF

### Financial Reports
- **Monthly Summary**: Income vs expenses for each month
- **Category Breakdown**: Spending by category
- **Annual Report**: Yearly financial overview
- **Balance Sheet**: Current financial position

## Activity Management

### Creating Activities

#### Basic Information
1. Navigate to "Activities" section
2. Click "Create New Activity"
3. Fill in activity details:
   - **Title**: Clear, descriptive name
   - **Description**: Detailed explanation of the activity
   - **Type**: Education, Service, Recreation, etc.
   - **Date and Time**: When the activity will occur
   - **Location**: Where the activity takes place

#### Advanced Options
- **Capacity**: Maximum number of participants
- **Registration Required**: Yes/No
- **Cost**: If there's any fee
- **Materials Needed**: List required items
- **Contact Person**: Responsible organizer

### Managing Activities

#### Activity Status
- **Planned**: Activity is scheduled but not yet started
- **Ongoing**: Activity is currently happening
- **Completed**: Activity has finished
- **Cancelled**: Activity was cancelled

#### Photo Documentation
1. Open activity details
2. Click "Add Photos"
3. Upload photos from your device
4. Add captions if needed
5. Photos are automatically optimized for web

#### Participant Management
- View registered participants
- Add participants manually
- Send notifications
- Track attendance

### Activity Calendar
- **Month View**: See all activities in calendar format
- **Week View**: Detailed weekly schedule
- **Day View**: Hour-by-hour activity breakdown
- **Export**: Export calendar to Google Calendar or Outlook

## Course Management

### Creating Courses

#### Course Setup
1. Go to "Courses" section
2. Click "Add New Course"
3. Enter course information:
   - **Course Name**: Full course title
   - **Description**: Course objectives and content
   - **Level**: Beginner, Intermediate, Advanced
   - **Duration**: Course length (weeks/months)
   - **Schedule**: Days and times
   - **Teacher**: Instructor name
   - **Capacity**: Maximum students

#### Enrollment Management
- Set enrollment periods
- Manage waiting lists
- Track student progress
- Generate completion certificates

### Course Monitoring
- **Attendance Tracking**: Mark present/absent
- **Progress Reports**: Student advancement
- **Material Distribution**: Share course resources
- **Assessment Results**: Grades and evaluations

### Teacher Dashboard
Teachers can:
- View their assigned courses
- Update course materials
- Track student attendance
- Provide feedback and grades

## Video Management

### Uploading Videos

#### Upload Process
1. Navigate to "Videos" section
2. Click "Upload Video"
3. Select video file from your device
4. Wait for upload to complete
5. Fill in video information:
   - **Title**: Descriptive video title
   - **Description**: What the video covers
   - **Category**: Subject area
   - **Teacher**: Instructor name
   - **Duration**: Video length (auto-detected)
   - **Visibility**: Public or Private

#### Video Categories
- **Islamic Studies**: Religious education content
- **Arabic Language**: Language learning videos
- **Quran Studies**: Recitation and memorization
- **General Education**: Other educational content

### Video Library
- **Browse by Category**: Find videos by subject
- **Search Function**: Search by title, teacher, or keyword
- **Recently Added**: See newest uploads
- **Most Popular**: Most viewed videos
- **My Favorites**: Personal video collections

### Video Player Features
- **Full Screen Mode**: Expand video to full screen
- **Speed Controls**: Adjust playback speed
- **Quality Settings**: Choose video resolution
- **Subtitles**: Available for supported videos
- **Download**: Download for offline viewing (if enabled)

## User Management (Admin Only)

### Adding New Users
1. Navigate to "Users" section
2. Click "Add New User"
3. Enter user details:
   - **Username**: Unique login identifier
   - **Email**: Contact email address
   - **Full Name**: User's complete name
   - **Role**: Admin or Staff
   - **Password**: Temporary password
4. Click "Create User"
5. User will receive login credentials via email

### Managing Existing Users
- **View All Users**: List of all system users
- **Edit User Info**: Update user details
- **Reset Password**: Generate new temporary password
- **Deactivate User**: Disable account access
- **User Activity**: See user login history and actions

### Role Permissions
- **Administrator**:
  - All system access
  - User management
  - System configuration
  - Financial oversight
  
- **Staff**:
  - Daily operations
  - Data entry and updates
  - Report generation
  - Limited administrative functions

## Offline Features

### How Offline Mode Works
The application automatically detects when you're offline and enables special features to continue working without internet connection.

### Offline Capabilities
- **View Data**: Access previously loaded information
- **Add Transactions**: Create new financial entries
- **Update Activities**: Modify activity information
- **Take Photos**: Document activities offline
- **View Videos**: Watch previously cached videos

### Data Synchronization
- **Automatic Sync**: When internet connection returns, all offline changes are automatically uploaded
- **Conflict Resolution**: If conflicts occur, the system will prompt you to choose which version to keep
- **Sync Status**: See when data was last synchronized

### Offline Indicators
- **Connection Status**: Icon shows online/offline status
- **Pending Changes**: Number of changes waiting to sync
- **Last Sync Time**: When data was last synchronized with server

## Troubleshooting

### Common Issues

#### Cannot Login
**Problem**: Login credentials not accepted
**Solutions**:
1. Check username spelling (case-sensitive)
2. Verify Caps Lock is not enabled
3. Clear browser cache and cookies
4. Try different browser
5. Contact administrator for password reset

#### Page Not Loading
**Problem**: Application pages load slowly or not at all
**Solutions**:
1. Check internet connection
2. Clear browser cache
3. Disable browser extensions
4. Try incognito/private browsing mode
5. Restart browser

#### Data Not Saving
**Problem**: Changes are not being saved
**Solutions**:
1. Check internet connection
2. Ensure all required fields are filled
3. Wait for save confirmation
4. If offline, changes will sync when online
5. Refresh page and try again

#### Video Won't Play
**Problem**: Videos not loading or playing
**Solutions**:
1. Check internet connection
2. Try different browser
3. Update browser to latest version
4. Clear browser cache
5. Check video format compatibility

#### Mobile Display Issues
**Problem**: Application not displaying correctly on mobile
**Solutions**:
1. Rotate device to landscape mode
2. Clear browser cache
3. Update mobile browser
4. Try different mobile browser
5. Check screen zoom level

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari (latest versions)
- **Minimum**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Not Supported**: Internet Explorer

### Performance Tips
1. **Close Unused Tabs**: Reduces memory usage
2. **Clear Cache Regularly**: Improves loading times
3. **Update Browser**: Latest versions perform better
4. **Stable Internet**: Use reliable internet connection
5. **Ad Blockers**: May interfere with functionality

### Getting Help

#### Self-Help Resources
- Check this user manual
- Look for error messages and follow suggested solutions
- Try the troubleshooting steps above

#### Contact Support
- **Administrator**: Contact your system administrator for account issues
- **Technical Issues**: Report bugs using the bug report template
- **Feature Requests**: Submit suggestions for new features
- **Training**: Request additional training sessions

#### Emergency Procedures
- If system is completely inaccessible, continue critical operations manually
- Document all manual entries for later system input
- Contact administrator immediately for urgent issues

### Data Backup
- System automatically backs up data regularly
- Users cannot directly access backup features
- In case of data loss, contact administrator immediately
- Keep manual records of critical transactions as backup

### Security Best Practices
1. **Strong Passwords**: Use complex, unique passwords
2. **Logout**: Always logout when finished, especially on shared computers
3. **Secure Networks**: Avoid public WiFi for sensitive operations
4. **Regular Updates**: Keep browser updated for security patches
5. **Report Issues**: Immediately report any security concerns

### Updates and Maintenance
- System updates occur automatically
- Users will be notified of scheduled maintenance
- During maintenance, some features may be temporarily unavailable
- No user action required for updates

## Conclusion

This user manual provides comprehensive guidance for using the Pondok Imam Syafi'i Blitar Management System. The system is designed to be intuitive and user-friendly while providing powerful features for managing the daily operations of the pondok.

For additional assistance or questions not covered in this manual, please contact your system administrator or technical support team.

---

**Version**: 1.0
**Last Updated**: [Current Date]
**Next Review**: [6 months from current date]