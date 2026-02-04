# Quick Start Guide - AFH Renovator Pro

Get up and running with AFH Renovator Pro in 5 minutes!

## 🚀 Installation (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

## 📝 First Use (3 minutes)

### Step 1: Enter Property Information
- Choose **MLS Number** or **Address**
- Enter property details
- ✅ Check "Use mock data" (for testing)

### Step 2: Generate Plan
- Click **"Generate Renovation Plan"**
- Wait for analysis (10-30 seconds)

### Step 3: Review Results
- View **Summary Cards** (tasks, cost, issues)
- Check **Compliance Issues** (critical/warning/info)
- Browse **Renovation Tasks** with priorities

### Step 4: Export PDF
- Click **"Export PDF"** button
- Save your renovation checklist

## 🎯 Key Features at a Glance

| Feature | What It Does |
|---------|-------------|
| **Property Fetch** | Gets property data from NWMLS or uses mock data |
| **Compliance Check** | Analyzes against DSHS AFH regulations |
| **Task Generation** | Creates prioritized renovation tasks |
| **Cost Estimates** | Provides cost and time estimates |
| **PDF Export** | Exports complete plan as PDF |

## 💡 Quick Tips

- **Mock Data**: Always enabled by default - perfect for testing
- **Real Data**: Uncheck mock data and enter NWMLS credentials
- **Priority**: Tasks are sorted by priority (High → Medium → Low)
- **DIY Flag**: Look for green "DIY" badges for DIY-friendly tasks
- **Permits**: Red "Permit Required" badges indicate permit needs

## 🔧 Troubleshooting

**Problem**: Build fails
- **Solution**: Run `npm install` again

**Problem**: Playwright errors
- **Solution**: Run `npx playwright install chromium`

**Problem**: Can't fetch property
- **Solution**: Use mock data mode (checked by default)

## 📚 Next Steps

- Read the [Full Manual](MANUAL.md) for detailed features
- Follow the [Tutorial](TUTORIAL.md) for step-by-step walkthrough
- Check [README.md](../README.md) for technical details

---

**Ready to go?** Start the dev server and generate your first plan! 🎉

