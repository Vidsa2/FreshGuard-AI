import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime
import os

# Create Gantt chart for FreshGuard AI Remaining Work (Nov 2026 - Jan 2027)
tasks = [
    ("Live GPS Courier Dispatch & Routing", "2026-11-17", "2026-12-01", "#2d6a4f"),
    ("WebSocket & WebPush Urgent (<12h) Alerts", "2026-11-24", "2026-12-08", "#52b788"),
    ("Multi-Category Produce Expansion (Bakery/Dairy)", "2026-12-01", "2026-12-15", "#1b4332"),
    ("Automated End-to-End Testing (Vitest & PyTest)", "2026-12-08", "2026-12-22", "#40916c"),
    ("Supermarket Field Pilot & Multi-User Testing", "2026-12-15", "2026-12-29", "#74c69d"),
    ("Security Hardening, Final Report & Documentation", "2026-12-22", "2027-01-10", "#2d6a4f"),
]

fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)

y_pos = range(len(tasks))
for i, (task, start_str, end_str, color) in enumerate(tasks):
    start = datetime.strptime(start_str, "%Y-%m-%d")
    end = datetime.strptime(end_str, "%Y-%m-%d")
    duration = (end - start).days
    ax.barh(i, duration, left=start, height=0.55, align='center', color=color, edgecolor='#1b4332', alpha=0.9)

# Format axis
ax.set_yticks(y_pos)
ax.set_yticklabels([t[0] for t in tasks], fontsize=10, fontweight='bold', color='#1e293b')
ax.invert_yaxis()  # top-down

# Current date line (Mid-term)
mid_term_date = datetime(2026, 11, 15)
ax.axvline(mid_term_date, color='#e11d48', linestyle='--', linewidth=2, label='Mid-Term Review (Nov 15)')
ax.text(mid_term_date, len(tasks) - 0.2, ' Mid-Term (Now)', color='#e11d48', fontweight='bold', fontsize=9)

ax.xaxis.set_major_locator(mdates.WeekdayLocator(interval=1))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %d'))
plt.xticks(fontsize=9, color='#334155')

ax.set_title("Figure 2: Remaining Work Timeline & Implementation Gantt Chart (Nov 2026 – Jan 2027)", fontsize=11, fontweight='bold', pad=15, color='#0f172a')
ax.grid(axis='x', linestyle=':', alpha=0.6)
ax.set_axisbelow(True)

plt.tight_layout()
out_path = r"C:\Users\LENOVO\Documents\Data_Management\gantt_chart.png"
plt.savefig(out_path, dpi=300)
print(f"Gantt chart saved to: {out_path}")
