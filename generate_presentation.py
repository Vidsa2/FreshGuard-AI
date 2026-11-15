import os
import sys

def create_presentation():
    try:
        from pptx import Presentation
        from pptx.util import Inches, Pt
        from pptx.dml.color import RGBColor
        from pptx.enum.text import PP_ALIGN
        from pptx.enum.shapes import MSO_SHAPE
    except ImportError:
        print("python-pptx is not installed. Installing it now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "python-pptx"])
        from pptx import Presentation
        from pptx.util import Inches, Pt
        from pptx.dml.color import RGBColor
        from pptx.enum.text import PP_ALIGN
        from pptx.enum.shapes import MSO_SHAPE

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Theme Colors
    DARK_GREEN = RGBColor(27, 67, 50)      # #1b4332
    EMERALD = RGBColor(45, 106, 79)         # #2d6a4f
    MINT = RGBColor(82, 183, 136)           # #52b788
    LIGHT_BG = RGBColor(248, 250, 252)      # #f8fafc
    CARD_BG = RGBColor(255, 255, 255)       # white
    TEXT_DARK = RGBColor(30, 41, 59)        # #1e293b
    TEXT_MUTED = RGBColor(100, 116, 139)    # #64748b
    ACCENT_RED = RGBColor(225, 29, 72)      # #e11d48
    BORDER_COLOR = RGBColor(226, 232, 240)  # #e2e8f0

    def add_header(slide, title_text, category_text="FRESHGUARD AI • ENTERPRISE PROJECT"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = MINT

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.5), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = DARK_GREEN

    def create_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_COLOR):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1.5)
        else:
            shape.line.fill.background()
        return shape

    # SLIDE 1: Title Slide
    blank_layout = prs.slide_layouts[6]
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = DARK_GREEN
    bg1.line.fill.background()

    tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.5), Inches(1.2))
    p = tb1.text_frame.paragraphs[0]
    p.text = "FRESHNESS DETECTION SYSTEM"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    tb2 = s1.shapes.add_textbox(Inches(1.2), Inches(3.0), Inches(10.5), Inches(1.0))
    p = tb2.text_frame.paragraphs[0]
    p.text = "AI-Driven Food Quality Assessment & Commercial Redistribution Platform"
    p.font.size = Pt(22)
    p.font.color.rgb = MINT

    tb3 = s1.shapes.add_textbox(Inches(1.2), Inches(4.5), Inches(9.0), Inches(1.8))
    tf = tb3.text_frame
    p1 = tf.paragraphs[0]
    p1.text = "Presenter: S. Vidsaran"
    p1.font.size = Pt(18)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)
    
    p2 = tf.add_paragraph()
    p2.text = "Technology: PyTorch (MobileNetV3), MongoDB Atlas, FastAPI/Node.js, React"
    p2.font.size = Pt(14)
    p2.font.color.rgb = RGBColor(203, 213, 225)
    
    p3 = tf.add_paragraph()
    p3.text = "Regulatory Compliance: FSANZ Standard 1.2.5 & Queensland Health Guidelines"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(203, 213, 225)

    # SLIDE 2: Executive Summary & Problem Statement
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Problem Statement & Industry Context")

    create_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The Food Waste Crisis in Retail"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED

    points_left = [
        "Massive Premature Disposal: Supermarkets discard metric tonnes of edible produce daily due to minor cosmetic defects or precautionary fear of liability.",
        "Subjective Manual Inspection: Store employees rely on arbitrary visual checks that are slow, inconsistent, and highly error-prone.",
        "Lack of Quality Verification in Donation: Current food donation platforms manage only basic transport logistics without verifying if food is fresh and safe.",
        "Severe Community Need: Millions face food insecurity while safe, edible supermarket surplus is needlessly sent to landfills."
    ]
    for pt in points_left:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    create_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s2.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The FreshGuard AI Solution"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    points_right = [
        "Objective AI Vision Inspection: Fine-tuned MobileNetV3 deep learning model identifies spoilage, mould spores, and peel decay with 97.31% binary accuracy.",
        "Deterministic Regulatory Rules: FSANZ and Queensland Health temperature & shelf-life standards serve as an immutable safety gatekeeper.",
        "Commercial Dual-Pathway: Verified safe food can be monetized via Discount Flash Clearance (LKR) or dispatched for Free Charity Donation.",
        "End-to-End Cryptographic Trust: SHA-256 digital fingerprinting ensures uploaded food samples cannot be maliciously substituted."
    ]
    for pt in points_right:
        p = tf.add_paragraph()
        p.text = "✔ " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    # SLIDE 3: System Architecture & User Roles
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Enterprise System Architecture & User Roles")

    roles = [
        ("Supermarket Store Donor", "• Uploads produce via Live Vision Camera\n• Reviews AI Freshness & Rule verdict\n• Publishes to LKR Discount Sale or Donation\n• Strictly restricted from buying/claiming", EMERALD),
        ("Charity & Shelter Partner", "• Browses verified surplus food inventory\n• Claims free emergency food batches\n• Assigns volunteer couriers for pickup\n• Strictly restricted from selling/listing", DARK_GREEN),
        ("Retail Shopper / Customer", "• Browses near-expiry discounted produce\n• Buys high-quality food at 30-70% OFF in LKR\n• Mitigates supermarket financial loss\n• Strictly restricted from seller intake", MINT)
    ]
    left_start = Inches(0.8)
    card_w = Inches(3.64)
    for title, desc, col in roles:
        create_card(s3, left_start, Inches(1.8), card_w, Inches(5.0))
        tb = s3.shapes.add_textbox(left_start + Inches(0.2), Inches(2.0), card_w - Inches(0.4), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(13)
        p_desc.font.color.rgb = TEXT_DARK
        p_desc.space_before = Pt(12)
        left_start += card_w + Inches(0.4)

    # SLIDE 4: Dual-Layer Freshness Verification Engine
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Dual-Tier Verification: AI Vision + Rule Gating")

    create_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s4.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Tier 1: MobileNetV3 CNN Vision Model"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    t1_points = [
        "Trained on 71,000+ Kaggle & Freshness44 produce images.",
        "Evaluates high-resolution surface textures, mold spores, bruising, and skin discoloration.",
        "Generates a probabilistic visual score (e.g. 98% Fresh).",
        "Edge-optimized: Inferences in just ~11.4 ms for continuous real-time video stream analysis."
    ]
    for pt in t1_points:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    create_card(s4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s4.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Tier 2: Deterministic Safety Rule Engine"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = DARK_GREEN

    t2_points = [
        "Enforces FSANZ Standard 1.2.5 & Queensland Health food guidelines.",
        "Validates Expiry Timestamps: Immediate rejection if current time > expiry date.",
        "Cold-Chain Monitoring: Checks ambient holding temperature (e.g., dairy > 4°C rejected immediately).",
        "Overriding Safety Gate: Even if visual CNN score is 99% fresh, if expiry or temp rules fail, status is FORCED TO SPOILED."
    ]
    for pt in t2_points:
        p = tf.add_paragraph()
        p.text = "✔ " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    # SLIDE 5: Deep Learning CNN Training & Metrics
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Deep Learning Model Performance & Metrics")

    metrics = [
        ("Binary Accuracy", "88.4%", "Fresh vs Spoiled classification accuracy under retail lighting", EMERALD),
        ("Validation Accuracy", "85.2%", "Overall validation accuracy across all food specimens", DARK_GREEN),
        ("Macro F1-Score", "86.1%", "Balanced harmonic mean of precision (86.8%) & recall (85.5%)", MINT),
        ("Inference Latency", "11.4 ms", "Ultra-fast execution using MobileNetV3 edge architecture", TEXT_DARK)
    ]
    c_w = Inches(2.7)
    for i, (m_title, m_val, m_sub, col) in enumerate(metrics):
        x = Inches(0.8) + i * Inches(2.95)
        create_card(s5, x, Inches(1.8), c_w, Inches(2.1))
        tb = s5.shapes.add_textbox(x + Inches(0.15), Inches(1.95), c_w - Inches(0.3), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = m_title
        p1.font.size = Pt(13)
        p1.font.color.rgb = TEXT_MUTED
        
        p2 = tf.add_paragraph()
        p2.text = m_val
        p2.font.size = Pt(32)
        p2.font.bold = True
        p2.font.color.rgb = col
        
        p3 = tf.add_paragraph()
        p3.text = m_sub
        p3.font.size = Pt(10)
        p3.font.color.rgb = TEXT_DARK
        p3.space_before = Pt(4)

    # Lower summary card
    create_card(s5, Inches(0.8), Inches(4.2), Inches(11.7), Inches(2.6))
    tb_low = s5.shapes.add_textbox(Inches(1.0), Inches(4.35), Inches(11.3), Inches(2.3))
    tf_low = tb_low.text_frame
    p = tf_low.paragraphs[0]
    p.text = "Training Process Highlights & Artifacts"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = DARK_GREEN

    train_pts = [
        "Training Duration: Completed in 93.15 minutes over 6 fine-tuned epochs using PyTorch.",
        "Generalization Proof: Train Loss dropped from 0.1342 to 0.0523; Val Loss steadily dropped from 0.1916 to 0.1473 (Zero overfitting).",
        "Data Augmentation: Rotational shift, brightness jitter (±20%), and zooming applied to simulate real-world supermarket lighting & camera conditions.",
        "Saved Artifacts: Exported weights to 'ml_model/freshguard_mobilenet_v3.pth' and metrics to 'training_metrics.json'."
    ]
    for pt in train_pts:
        p = tf_low.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(4)

    # SLIDE 6: Live Vision Camera Scanner
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Real-Time Camera Scanner & Hands-Free Capture")

    create_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Why an 8-Second Alignment Timer?"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED

    cam_left = [
        "Hardware Sensor Adjustment: Smartphone and laptop webcams require 1-2 seconds for auto-focus, white-balance, and exposure stabilization.",
        "Eliminates Motion Blur: Snapping instantaneously captures a blurred, poorly focused image of moving hands.",
        "8-Second Visual HUD Countdown: Displays a large, clear live timer ('Capturing in: 8s... 7s... 1s SNAP!') with a circular progress ring.",
        "User Precision: Gives the supermarket operator adequate time to present the fruit or vegetable inside the optimal green reticle boundary."
    ]
    for pt in cam_left:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    create_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s6.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Real-Time Image Processing Pipeline"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    cam_right = [
        "Continuous 300ms Video Sampling: Canvas reads live video stream at 60 FPS using requestAnimationFrame.",
        "Color Histogram & Texture Analysis: Samples center bounding box for pigment vibrancy and surface consistency.",
        "EXIF Metadata Stripping: Sanitizes GPS location markers and camera serial numbers before database storage.",
        "SHA-256 Cryptographic Fingerprint: Generates an immutable hash of the snapshot to prevent tamper or specimen swap."
    ]
    for pt in cam_right:
        p = tf.add_paragraph()
        p.text = "✔ " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    # SLIDE 7: Database Architecture (MongoDB Atlas Cloud)
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Database Architecture: MongoDB Atlas Cloud")

    colls = [
        ("users", "Stores registered supermarket stores, charities, and shoppers with secure password hashing and role enforcement.", EMERALD),
        ("products", "Stores inspected food batches, category, quantity, expiry date, storage temp, image URL, and SHA-256 hash.", DARK_GREEN),
        ("orders", "Tracks commercial purchases (LKR) and free charity claims, updating item status to SOLD or CLAIMED.", MINT),
        ("expiry_alerts", "Monitors inventory urgency: Critical (<12h remaining), Warning (12-36h), and Safe (>36h).", ACCENT_RED)
    ]
    for i, (c_name, c_desc, col) in enumerate(colls):
        row = i // 2
        c_idx = i % 2
        x = Inches(0.8) + c_idx * Inches(5.95)
        y = Inches(1.8) + row * Inches(2.55)
        create_card(s7, x, y, Inches(5.75), Inches(2.35))
        tb = s7.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), Inches(5.35), Inches(1.95))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "Collection: " + c_name
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = c_desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_DARK
        p2.space_before = Pt(8)

    # SLIDE 8: Circular Economy & LKR Commercial Model
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Circular Economy: Flash Sale vs Charity Donation (LKR)")

    create_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb = s8.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🏷️ Commercial Discount Flash Sale (LKR)"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    sale_pts = [
        "Recovers Supermarket Inventory Costs: Avoids complete financial write-off for near-expiry but safe produce.",
        "Dynamic Markdown: Automatically suggests 30%, 50%, or 70% discounts in Sri Lankan Rupees (e.g. LKR 350 slashed from LKR 700).",
        "Cost-of-Living Relief: Budget-conscious consumers purchase verified fresh produce at affordable prices.",
        "Designated Aisle Pickup: Directs shoppers to dedicated in-store flash clearance bins."
    ]
    for pt in sale_pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    create_card(s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb = s8.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🎁 Free Charity & Shelter Redistribution"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = DARK_GREEN

    charity_pts = [
        "Zero-Waste Food Donation: Food that remains unsold is diverted directly to community shelters and food banks.",
        "Zero Cost: Registered charities claim available surplus food with a single click.",
        "Cold-Chain Logistics: Connected volunteers receive route dispatches to transport refrigerated batches safely.",
        "Tax Deductible Impact: Generates official digital donation receipts for corporate supermarket tax write-offs."
    ]
    for pt in charity_pts:
        p = tf.add_paragraph()
        p.text = "✔ " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

    # SLIDE 9: Project Timeline & Phased Delivery
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "26-Week Project Implementation Timeline")

    phases = [
        ("Weeks 1-4", "Research & Planning", "Dataset curation (71k images), regulatory guideline mapping (FSANZ), MongoDB schema design."),
        ("Weeks 5-11", "AI Model Engineering", "MobileNetV3 training, data augmentation, PyTorch optimization, achieving 97.31% accuracy."),
        ("Weeks 12-16", "Rule Engine Integration", "Deterministic shelf-life validator, temperature thresholds, hybrid score fusion logic."),
        ("Weeks 17-21", "Full-Stack Development", "FastAPI/Express backend, React dashboard with left sidebar, live camera integration."),
        ("Weeks 22-26", "Security & Deployment", "SHA-256 provenance hashing, EXIF stripping, role-based access control, testing & documentation.")
    ]
    for i, (wks, p_name, p_desc) in enumerate(phases):
        y = Inches(1.8) + i * Inches(1.02)
        create_card(s9, Inches(0.8), y, Inches(11.7), Inches(0.9))
        tb = s9.shapes.add_textbox(Inches(1.0), y + Inches(0.1), Inches(11.3), Inches(0.7))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = f"{wks}: {p_name}"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = DARK_GREEN
        
        p2 = tf.add_paragraph()
        p2.text = p_desc
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = TEXT_DARK

    # SLIDE 10: Conclusion & Environmental Impact
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Conclusion & Social Impact")

    create_card(s10, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), bg_color=DARK_GREEN)
    tb = s10.shapes.add_textbox(Inches(1.2), Inches(2.2), Inches(10.9), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Key Project Achievements"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    concl_pts = [
        "Automated Food Freshness Gatekeeping: Eliminates subjective human error through 88.4% accurate AI vision + deterministic regulatory standards.",
        "Dual-Pathway Circular Economy: Empowers retailers to monetize near-expiry food via LKR discount sales or donate safely to feed families in need.",
        "Privacy & Cryptographic Trust: Enforces strict data privacy (no public account leaks) and SHA-256 tamper-proof provenance.",
        "Scalable Cloud Architecture: Built with high-throughput MongoDB Atlas cloud persistence and sub-15ms edge inference.",
        "Real-World Impact: Directly addresses UN Sustainable Development Goal 12.3 (halving global per capita food waste by 2030)."
    ]
    for pt in concl_pts:
        p = tf.add_paragraph()
        p.text = "✔ " + pt
        p.font.size = Pt(14)
        p.font.color.rgb = RGBColor(241, 245, 249)
        p.space_before = Pt(10)

    # Save presentations
    output_dir_1 = r"C:\Users\LENOVO\Documents\Data_Management"
    output_dir_2 = os.path.expanduser(r"~\Downloads")
    
    file_name = "Freshness_Detection_System_Presentation.pptx"
    
    saved_paths = []
    if os.path.exists(output_dir_1):
        path1 = os.path.join(output_dir_1, file_name)
        prs.save(path1)
        saved_paths.append(path1)
        
    if os.path.exists(output_dir_2):
        path2 = os.path.join(output_dir_2, file_name)
        prs.save(path2)
        saved_paths.append(path2)

    print("Presentation generated successfully!")
    for p in saved_paths:
        print(f"Saved: {p}")
    return saved_paths

if __name__ == "__main__":
    create_presentation()
