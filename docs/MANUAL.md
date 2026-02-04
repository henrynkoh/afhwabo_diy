# User Manual - AFH Renovator Pro

Complete guide to using AFH Renovator Pro for Adult Family Home renovation planning and DSHS licensing preparation.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Property Input](#property-input)
4. [Understanding Results](#understanding-results)
5. [Renovation Tasks](#renovation-tasks)
6. [PDF Export](#pdf-export)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

**AFH Renovator Pro** is a comprehensive tool designed for real estate brokers and property owners preparing properties for Adult Family Home (AFH) licensing in Washington state. The application:

- Fetches property data from NWMLS Matrix
- Analyzes compliance with DSHS regulations (WAC 388-76)
- Generates customized renovation plans
- Provides cost estimates and material lists
- Exports professional PDF reports

### Who Should Use This?

- Licensed real estate brokers with NWMLS access
- Property owners preparing for AFH licensing
- Contractors working on AFH conversions
- Investors evaluating AFH property potential

---

## Getting Started

### System Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet**: Required for NWMLS data fetching
- **NWMLS Access**: Broker-level Matrix subscription (optional - mock data available)

### First Launch

1. Navigate to the application URL
2. You'll see the **Property Input Form**
3. Choose between **MLS Number** or **Address** input
4. For first-time testing, keep **"Use mock data"** checked

---

## Property Input

### Option 1: MLS Number

**Best for**: Properties listed in NWMLS Matrix

1. Click **"MLS Number"** button
2. Enter the MLS number (e.g., `9876543`)
3. Check/uncheck **"Use mock data"** as needed
4. Click **"Generate Renovation Plan"**

**Example**: `9876543`, `1234567`, `5551234`

### Option 2: Property Address

**Best for**: Properties not in MLS or known addresses

1. Click **"Address"** button
2. Enter street address (e.g., `1234 Example St`)
3. Enter city (default: `Seattle`)
4. Enter state (default: `WA`)
5. Check/uncheck **"Use mock data"** as needed
6. Click **"Generate Renovation Plan"**

**Example**:
- Address: `1234 Example Street`
- City: `Seattle`
- State: `WA`

### Mock Data Mode

**When to use**: Testing, development, or when NWMLS credentials aren't available

- ✅ **Enabled by default** for easy testing
- Generates realistic sample property data
- Perfect for learning the interface
- No credentials required

### Real NWMLS Mode

**When to use**: Production use with actual property data

- ⚠️ Requires active NWMLS Matrix broker access
- Fetches real property details
- More accurate compliance analysis
- Credentials handled securely

---

## Understanding Results

After generating a plan, you'll see the **Renovation Dashboard** with several sections:

### Summary Cards

Four key metrics at the top:

1. **Total Tasks**: Number of renovation tasks identified
2. **Estimated Cost**: Total estimated renovation cost
3. **Critical Issues**: Number of critical compliance issues
4. **DIY Tasks**: Number of DIY-friendly tasks

### Property Information

Displays extracted property data:
- MLS Number (if available)
- Square Feet
- Bedrooms
- Bathrooms
- Year Built
- Levels

### Compliance Issues

Organized by severity:

#### 🔴 Critical Issues
- **Must be addressed** before licensing
- Examples: Missing egress windows, insufficient bedroom size, no smoke detectors
- **Action**: Address immediately

#### 🟡 Warnings
- **Should be addressed** for best practices
- Examples: Narrow doors, missing grab bars, temperature control
- **Action**: Plan to address

#### 🔵 Information
- **Good to know** items
- Examples: Permit requirements, pest control, separation needs
- **Action**: Review and plan

Each issue shows:
- **Description**: What's wrong
- **Location**: Where it applies
- **Rule**: DSHS regulation reference (WAC 388-76-XXXX)

### Renovation Tasks

Prioritized list of tasks to complete. See [Renovation Tasks](#renovation-tasks) section for details.

---

## Renovation Tasks

Each task card displays:

### Task Header
- **Title**: Task name
- **Priority Badge**: High (red), Medium (yellow), Low (blue)
- **DIY Badge**: Green "DIY" or orange "Professional"
- **Permit Badge**: Purple "Permit Required" (if applicable)

### Task Details

#### Location
Where the work needs to be done (e.g., "All bedrooms", "Kitchen", "Entry")

#### Cost Estimate
Estimated cost in USD (e.g., `$2,000`, `$150`)

#### Time Estimate
Estimated completion time (e.g., "2-3 days", "1 hour", "1-2 weeks")

#### Category
Task category: Bedroom, Bathroom, Safety, Accessibility, Other

#### Materials Needed
List of required materials:
- Grab bars
- Smoke detectors
- Drywall
- Paint
- etc.

#### Placement Notes
Visual guidance on where to install items (e.g., "Install on both sides of each stairway")

### Task Priority

Tasks are automatically sorted by:
1. **Priority** (High → Medium → Low)
2. **Order** (within same priority)

### DIY vs. Professional

- **DIY-Friendly** (Green badge): Can be done by property owner
  - Examples: Installing grab bars, smoke detectors, fire extinguishers
  - Lower cost, no special licensing

- **Professional Required** (Orange badge): Needs licensed contractor
  - Examples: Electrical work, plumbing, structural changes
  - Higher cost, may require permits

### Permit Requirements

Tasks marked with **"Permit Required"** need:
- Local building department approval
- Professional contractor (usually)
- Inspection after completion
- Examples: Structural changes, electrical, plumbing modifications

---

## PDF Export

### Exporting Your Plan

1. Review the generated plan
2. Click **"Export PDF"** button (top right)
3. PDF downloads automatically
4. File name format: `afh-plan-[MLS-or-Address].pdf`

### PDF Contents

The exported PDF includes:

1. **Property Information**
   - Address, MLS number, square footage, bedrooms, bathrooms, year built

2. **Summary**
   - Total tasks, estimated cost, critical issues, DIY vs. professional breakdown

3. **Compliance Issues**
   - All issues organized by severity
   - Rule references and locations

4. **Renovation Tasks**
   - Complete task list with:
     - Priority
     - Location
     - Cost and time estimates
     - DIY/Professional flags
     - Permit requirements
     - Descriptions

5. **Footer**
   - Generation timestamp

### Using the PDF

- **Print**: Use for on-site reference
- **Share**: Send to contractors, inspectors, or team members
- **Archive**: Keep for records and licensing documentation
- **Planning**: Use as checklist during renovation

---

## Advanced Features

### State Management

Your plans are automatically saved to browser localStorage:
- Plans persist between sessions
- Credentials stored securely (encrypted)
- Clear data: Use browser settings to clear storage

### Multiple Properties

Generate plans for multiple properties:
1. Generate first plan
2. Click **"Generate New Plan"** at bottom
3. Enter new property information
4. Previous plan replaced (or export before generating new)

### Cost Tracking

Use the cost estimates to:
- Create renovation budgets
- Compare contractor quotes
- Plan financing
- Track progress

### Compliance Tracking

Use compliance issues to:
- Prioritize critical fixes
- Prepare for DSHS inspections
- Document compliance efforts
- Identify potential licensing delays

---

## Troubleshooting

### Property Data Not Loading

**Symptoms**: Loading spinner never completes, error message appears

**Solutions**:
1. Check internet connection
2. Verify NWMLS credentials (if using real data)
3. Try mock data mode
4. Check browser console for errors
5. Refresh page and try again

### PDF Export Not Working

**Symptoms**: PDF doesn't download, error appears

**Solutions**:
1. Check browser pop-up blocker settings
2. Ensure sufficient disk space
3. Try different browser
4. Check browser console for errors

### Incorrect Property Data

**Symptoms**: Property details don't match actual property

**Solutions**:
1. Verify MLS number is correct
2. Check address spelling and format
3. Use real NWMLS data instead of mock
4. Contact support if issue persists

### Compliance Issues Seem Incorrect

**Symptoms**: Issues flagged that shouldn't be, or missing issues

**Solutions**:
1. Verify property data accuracy
2. Review DSHS regulations (WAC 388-76)
3. Consult with DSHS representative
4. Report discrepancies to support

### Slow Performance

**Symptoms**: Long loading times, interface lag

**Solutions**:
1. Check internet speed
2. Close other browser tabs
3. Clear browser cache
4. Try different browser
5. Check system resources

---

## FAQ

### General Questions

**Q: Do I need NWMLS access to use this?**
A: No! Mock data mode works without credentials. Real NWMLS access provides more accurate data.

**Q: Is this free to use?**
A: Check with your organization or license agreement.

**Q: Can I use this for properties outside Washington?**
A: The compliance rules are specific to Washington DSHS. For other states, you'd need different regulations.

**Q: How accurate are the cost estimates?**
A: Estimates are based on typical renovation costs. Actual costs may vary based on location, contractor, and market conditions.

**Q: Can I edit the generated plan?**
A: Currently, plans are generated automatically. Export to PDF and edit manually, or contact support for customization options.

### Technical Questions

**Q: What browsers are supported?**
A: Chrome, Firefox, Safari, and Edge (latest versions). Chrome recommended for best performance.

**Q: Do I need to install anything?**
A: No installation needed - it's a web application. Just open in your browser.

**Q: Is my data secure?**
A: Yes. NWMLS credentials are stored locally (encrypted) and never sent to external servers except NWMLS Matrix.

**Q: Can I use this offline?**
A: No, internet connection is required for property data fetching and plan generation.

**Q: How do I update the application?**
A: If self-hosted, pull latest code and rebuild. If hosted, updates are automatic.

### Compliance Questions

**Q: Does this guarantee DSHS approval?**
A: No. This tool helps identify compliance issues, but final approval is at DSHS discretion.

**Q: Are all DSHS rules included?**
A: The tool covers major WAC 388-76 requirements. Some specific rules may need manual review.

**Q: What if I disagree with a compliance issue?**
A: Review the specific DSHS rule (WAC reference provided). Consult with DSHS if needed.

**Q: How often are regulations updated?**
A: DSHS regulations change periodically. The tool should be updated accordingly.

### Usage Questions

**Q: Can I save multiple plans?**
A: Currently, one plan is stored at a time. Export PDFs to save multiple plans.

**Q: Can I share plans with others?**
A: Yes! Export PDF and share the file. Or share your screen during review.

**Q: How long does plan generation take?**
A: Typically 10-30 seconds, depending on property complexity and data source.

**Q: Can I print the dashboard?**
A: Use PDF export for best printing results, or use browser print function.

---

## Support

For additional help:
- Review the [Tutorial](TUTORIAL.md) for step-by-step guidance
- Check [Quick Start Guide](QUICKSTART.md) for basics
- Contact your system administrator
- Refer to [README.md](../README.md) for technical details

---

**Last Updated**: 2026
**Version**: 1.0.0

