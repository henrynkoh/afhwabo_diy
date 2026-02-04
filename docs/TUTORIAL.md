# Step-by-Step Tutorial - AFH Renovator Pro

Follow this tutorial to learn how to use AFH Renovator Pro from start to finish.

## Tutorial Overview

**Time Required**: 15-20 minutes  
**Difficulty**: Beginner-friendly  
**What You'll Learn**: Complete workflow from property input to PDF export

---

## Part 1: Getting Started (5 minutes)

### Step 1: Launch the Application

1. Open your web browser (Chrome recommended)
2. Navigate to the application URL
3. You should see the **Property Input Form**

**What you see**:
- Title: "AFH Renovator Pro"
- Two buttons: "MLS Number" and "Address"
- Input fields
- "Use mock data" checkbox (checked by default)
- "Generate Renovation Plan" button

### Step 2: Choose Input Method

**For this tutorial, we'll use MLS Number with mock data.**

1. Click the **"MLS Number"** button (should be selected by default)
2. Notice the input field appears below
3. Keep **"Use mock data"** checked ✅

**Why mock data?**
- No credentials needed
- Instant results
- Perfect for learning
- Safe to experiment

### Step 3: Enter Property Information

1. In the **MLS Number** field, type: `9876543`
2. Verify **"Use mock data"** is still checked
3. Review the security note below the checkbox

**Your screen should show**:
```
[MLS Number] [Address]  ← Buttons
MLS Number: [9876543]   ← Input field
☑ Use mock data (for testing without NWMLS credentials)
[Note about credentials]
[Generate Renovation Plan] ← Button
```

---

## Part 2: Generating Your First Plan (5 minutes)

### Step 4: Generate the Plan

1. Click the **"Generate Renovation Plan"** button
2. Watch for the loading spinner
3. Wait 10-30 seconds for processing

**What's happening**:
- Property data is being fetched (or generated if mock)
- Compliance analysis is running
- Renovation tasks are being generated
- Plan is being assembled

### Step 5: Review the Dashboard

Once loading completes, you'll see the **Renovation Dashboard**.

**Take a moment to observe**:
- Header with property address
- "Export PDF" button (top right)
- Four summary cards at the top
- Property information section
- Compliance issues section
- Renovation tasks section

---

## Part 3: Understanding the Results (10 minutes)

### Step 6: Examine Summary Cards

Look at the four cards at the top:

**Card 1: Total Tasks**
- Shows number like "12" or "15"
- This is how many renovation tasks were identified

**Card 2: Estimated Cost**
- Shows dollar amount like "$12,500"
- Total estimated cost for all tasks

**Card 3: Critical Issues**
- Red number like "5"
- Critical compliance issues that must be fixed

**Card 4: DIY Tasks**
- Green number like "8"
- Tasks you can do yourself

**Action**: Note these numbers - we'll refer to them later.

### Step 7: Review Property Information

Scroll to the **Property Information** card:

**You should see**:
- Address: "1234 Example Street, Seattle, WA 98105"
- MLS Number: "9876543"
- Square Feet: "2,500"
- Bedrooms: "4"
- Bathrooms: "2.5"
- Year Built: "1985"
- Levels: "2"

**This is the property data** used for analysis.

### Step 8: Analyze Compliance Issues

Scroll to **Compliance Issues** section:

**You'll see three subsections**:

#### 🔴 Critical Issues
- Red background
- "CRITICAL" badges
- Examples you might see:
  - "Bedroom must be at least 80 sq ft"
  - "Interconnected smoke detectors required"
  - "Egress windows required in bedrooms"

**Action**: Count how many critical issues you see.

#### 🟡 Warnings
- Yellow background
- "WARNING" badges
- Examples:
  - "Doors should be ≥32" clear width"
  - "Non-slip surfaces required"

**Action**: Review a few warnings to understand the format.

#### 🔵 Information
- Blue background
- "INFO" badges
- Examples:
  - "Verify permits required"
  - "Pest control measures needed"

**Understanding the format**:
Each issue shows:
- **Description**: What's wrong
- **Location**: Where it applies
- **Rule**: DSHS regulation (WAC 388-76-XXXX)
- **Badge**: Severity level

### Step 9: Explore Renovation Tasks

Scroll to **Renovation Tasks** section:

**You'll see multiple task cards**. Let's examine one in detail:

**Pick any task card** and identify:

1. **Title**: Task name (e.g., "Install Grab Bars in All Bathrooms")
2. **Priority Badge**: Red (High), Yellow (Medium), or Blue (Low)
3. **DIY Badge**: Green "DIY" or Orange "Professional"
4. **Permit Badge**: Purple "Permit Required" (if present)

**In the card body, find**:
- **Location**: Where work is needed
- **Cost**: Estimated cost (e.g., "$200")
- **Time**: Estimated time (e.g., "2-3 hours per bathroom")
- **Category**: Bedroom, Bathroom, Safety, etc.
- **Materials Needed**: List of materials
- **Placement Notes**: Where to install

**Action**: Read through 3-4 different task cards to see variety.

### Step 10: Understand Task Priorities

**Notice the task order**:
- High priority tasks appear first (red badges)
- Medium priority next (yellow badges)
- Low priority last (blue badges)

**Why this matters**:
- Address critical issues first
- Plan your renovation timeline
- Budget accordingly

**Action**: Identify the highest priority task in your list.

---

## Part 4: Exporting Your Plan (2 minutes)

### Step 11: Export to PDF

1. Scroll back to the top of the dashboard
2. Find the **"Export PDF"** button (top right, next to title)
3. Click the button
4. PDF should download automatically

**What happens**:
- PDF is generated with all plan data
- File downloads to your default download folder
- Filename: `afh-plan-9876543.pdf` (or similar)

### Step 12: Review the PDF

1. Open the downloaded PDF
2. Scroll through the pages

**You should see**:
- **Page 1**: Title, Property Information, Summary
- **Page 2+**: Compliance Issues (if any)
- **Page 3+**: Renovation Tasks (detailed list)
- **Last Page**: Footer with generation timestamp

**Use cases for PDF**:
- Print for on-site reference
- Share with contractors
- Submit with licensing applications
- Keep for records

---

## Part 5: Advanced Practice (Optional)

### Step 13: Try Address Input

1. Click **"Generate New Plan"** (bottom of page)
2. Click **"Address"** button
3. Enter:
   - Address: `456 Main Street`
   - City: `Seattle`
   - State: `WA`
4. Keep mock data checked
5. Generate new plan

**Compare**: Notice how different property data creates different tasks.

### Step 14: Analyze Different Property Types

**Try generating plans for**:
- Small property (2 bedrooms, 1 bathroom)
- Large property (5+ bedrooms, 3+ bathrooms)
- Older property (pre-1980)
- Newer property (post-2000)

**Observe**: How tasks and issues change based on property characteristics.

### Step 15: Focus on Specific Categories

**Practice filtering mentally**:
- Find all **Bedroom** tasks
- Find all **Safety** tasks
- Find all **DIY-friendly** tasks
- Find all tasks requiring **permits**

**This helps**:
- Plan renovation phases
- Budget by category
- Assign work (DIY vs. contractor)

---

## Part 6: Real-World Application

### Step 16: Using Real NWMLS Data

**When ready for production**:

1. Ensure you have NWMLS Matrix broker access
2. Uncheck **"Use mock data"**
3. Enter NWMLS credentials when prompted
4. Enter real MLS number or address
5. Generate plan with actual property data

**Benefits**:
- Accurate property dimensions
- Real room layouts
- Actual photos and floor plans
- More precise compliance analysis

### Step 17: Working with Contractors

**Use the plan to**:
1. Export PDF
2. Share with contractors for quotes
3. Compare estimates to plan estimates
4. Verify all critical issues are addressed

### Step 18: Preparing for DSHS Inspection

**Before inspection**:
1. Review all critical issues
2. Verify tasks are completed
3. Check permit requirements
4. Keep PDF plan as documentation

---

## Tutorial Summary

**What you learned**:
✅ How to input property information  
✅ How to generate renovation plans  
✅ How to read compliance issues  
✅ How to understand task priorities  
✅ How to export PDF reports  

**Key takeaways**:
- Mock data is perfect for learning
- Tasks are automatically prioritized
- PDF export creates shareable reports
- Compliance issues guide renovation priorities

**Next steps**:
- Read the [Full Manual](MANUAL.md) for detailed features
- Check [Quick Start Guide](QUICKSTART.md) for reference
- Start using with real properties

---

## Practice Exercises

**Exercise 1**: Generate 3 different plans and compare task counts

**Exercise 2**: Find the most expensive task in a plan

**Exercise 3**: Identify all DIY-friendly tasks in a plan

**Exercise 4**: Export PDF and review formatting

**Exercise 5**: Calculate total cost for only high-priority tasks

---

**Congratulations!** You've completed the tutorial. You're now ready to use AFH Renovator Pro effectively! 🎉

