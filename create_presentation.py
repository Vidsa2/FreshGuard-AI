import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen format
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_DARK_BG    = RGBColor(15, 23, 42)      # #0f172a (Dark Slate)
    C_LIGHT_BG   = RGBColor(248, 250, 252)  # #f8fafc (Slate 50)
    C_WHITE      = RGBColor(255, 255, 255)
    C_CARD_BG    = RGBColor(255, 255, 255)  # Clean white card
    C_CARD_ALT   = RGBColor(241, 245, 249)  # #f1f5f9
    C_BORDER     = RGBColor(226, 232, 240)  # #e2e8f0
    C_EMERALD    = RGBColor(21, 128, 61)    # #15803d (Forest Green)
    C_EMERALD_LT = RGBColor(34, 197, 94)    # #22c55e (Green 500)
    C_MINT       = RGBColor(52, 211, 153)   # #34d399 (Mint)
    C_TEXT_DARK  = RGBColor(17, 24, 39)     # #111827 (Gray 900)
    C_TEXT_MUTED = RGBColor(100, 116, 139)  # #64748b (Slate 500)
    C_TEXT_SUB   = RGBColor(71, 85, 105)    # #475569 (Slate 600)
    C_AMBER      = RGBColor(217, 119, 6)    # #d97706
    C_BLUE       = RGBColor(37, 99, 235)    # #2563eb
    C_PURPLE     = RGBColor(147, 51, 234)   # #9333ea

    # Helper: Add Standard Header on White Slides
    def add_header(slide, slide_num, title, subtitle):
        # Header container
        top_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.1))
        tf = top_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Eyebrow / breadcrumb
        p0 = tf.paragraphs[0]
        p0.text = f"CO3554: DATA MANAGEMENT PROJECT  |  SLIDE {slide_num:02d}"
        p0.font.name = "Arial"
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = C_EMERALD

        # Title
        p1 = tf.add_paragraph()
        p1.text = title
        p1.font.name = "Arial"
        p1.font.size = Pt(22)
        p1.font.bold = True
        p1.font.color.rgb = C_TEXT_DARK
        p1.space_before = Pt(3)

        # Subtitle
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.name = "Arial"
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_TEXT_MUTED
        p2.space_before = Pt(2)

    # Helper: Add Card Rectangle
    def add_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1)
        else:
            shape.line.fill.background()
        return shape

    # Helper: Add Footer on Standard White Slides
    def add_footer(slide):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.35))
        tf = footer_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "FreshGuard AI  •  Mid Progress Presentation  •  CO3554 Data Management Project  •  FSANZ & HACCP Compliant"
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Dark Slate Theme with Emerald Glow)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_DARK_BG
    bg1.line.fill.background()

    # Emerald Accent Stripe
    stripe = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.12), Inches(4.8))
    stripe.fill.solid()
    stripe.fill.fore_color.rgb = C_MINT
    stripe.line.fill.background()

    title_box = slide1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(11.0), Inches(4.8))
    tf1 = title_box.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "CO3554 – DATA MANAGEMENT PROJECT  |  PERFORMANCE COMPUTING"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_MINT

    p = tf1.add_paragraph()
    p.text = "FRESHGUARD AI"
    p.font.name = "Arial"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_before = Pt(8)

    p = tf1.add_paragraph()
    p.text = "AI-Driven Food Freshness Detection & Zero-Waste Redistribution System"
    p.font.name = "Arial"
    p.font.size = Pt(18)
    p.font.color.rgb = RGBColor(203, 213, 225) # Slate 300
    p.space_before = Pt(6)

    p = tf1.add_paragraph()
    p.text = "Mid Progress Milestone Presentation"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD_LT
    p.space_before = Pt(18)

    p = tf1.add_paragraph()
    p.text = "Presenter: Vidsaran Sivapatham  •  Reg No: 21/ENG/116\nDepartment of Computer Engineering  •  Academic Year 2026"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(148, 163, 184) # Slate 400
    p.space_before = Pt(16)

    # =========================================================================
    # SLIDE 2: INTRODUCTION & EXECUTIVE SUMMARY
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, 2, "Introduction & Project Summary", "Solving retail food waste through deep visual inspection & automated redistribution")
    add_footer(slide2)

    card_w = Inches(3.7)
    card_h = Inches(4.8)
    col_gap = Inches(0.31)

    cards_s2 = [
        ("01. Live Vision Lens", C_EMERALD, [
            ("MobileNetV3 Binary CNN", "Trained on 71,000+ Kaggle images to classify produce as Fresh or Spoiled in <15ms."),
            ("Hands-Free Auto-Capture", "1.5s stability hold-to-scan engine with circular SVG lock and synthetic audio feedback."),
            ("Continuous Frame Sampling", "250ms optical canvas evaluator tracks pigment vibrancy & surface blemish factor.")
        ]),
        ("02. Safety Rule Engine", C_BLUE, [
            ("FSANZ Standard 1.2.5", "Validates official date marks, expiry countdowns, and ambient vs chilled thresholds."),
            ("HACCP Temperature Limits", "Enforces cold chain standards (<4°C / -18°C) to prevent bacterial propagation."),
            ("Dual-Validation Gate", "AI confidence is cross-referenced with physical storage rules before approval.")
        ]),
        ("03. Multi-Party Hub", C_PURPLE, [
            ("Strict Multi-Tenant Privacy", "Zero public directories. Supermarkets, charities, and shoppers operate in isolated tenants."),
            ("Dual Action Branching", "Fresh items are dynamically listed for clearance sale or donated free to shelters."),
            ("MongoDB Atlas Cloud", "Live cloud persistence across users, products, orders, and cryptographic audit ledgers.")
        ])
    ]

    for i, (col_title, col_accent, items) in enumerate(cards_s2):
        cx = Inches(0.8) + i * (card_w + col_gap)
        add_card(slide2, cx, Inches(1.8), card_w, card_h)

        tb = slide2.shapes.add_textbox(cx + Inches(0.25), Inches(2.0), card_w - Inches(0.5), card_h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = col_title
        p.font.name = "Arial"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col_accent

        for sub_h, sub_d in items:
            p = tf.add_paragraph()
            p.text = sub_h
            p.font.name = "Arial"
            p.font.size = Pt(12)
            p.font.bold = True
            p.font.color.rgb = C_TEXT_DARK
            p.space_before = Pt(10)

            p = tf.add_paragraph()
            p.text = sub_d
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = C_TEXT_SUB
            p.space_before = Pt(2)

    # =========================================================================
    # SLIDE 3: PROBLEM DEFINITION
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, 3, "Problem Definition & Motivation", "Key bottlenecks leading to premature disposal and unsafe food donations")
    add_footer(slide3)

    problems = [
        ("01", "Massive Commercial Food Waste", "Supermarkets and grocers discard thousands of tons of edible food annually due to cosmetic imperfections, minor skin blemishes, or arbitrary date marks.", C_AMBER),
        ("02", "Subjective Manual Inspection", "Manual staff visual checks are slow, inconsistent, and error-prone across work shifts, resulting in either unnecessary waste or spoiled food slipping through.", C_EMERALD),
        ("03", "No Freshness Checks on Donations", "Traditional food rescue systems focus purely on transportation logistics, without verifying whether donated surplus is biologically fresh and safe for human consumption.", C_BLUE),
        ("04", "Data Silos & Storage Mishandling", "Businesses lack real-time integration between cold-chain sensors, temperature storage logs, and shelf-life pricing markdown algorithms.", C_PURPLE),
    ]

    for i, (num, h_text, d_text, color) in enumerate(problems):
        row = i // 2
        col = i % 2
        px = Inches(0.8) + col * Inches(5.9)
        py = Inches(1.8) + row * Inches(2.4)

        add_card(slide3, px, py, Inches(5.6), Inches(2.1))

        tb = slide3.shapes.add_textbox(px + Inches(0.25), py + Inches(0.2), Inches(5.1), Inches(1.7))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"CHALLENGE {num}: {h_text}"
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color

        p = tf.add_paragraph()
        p.text = d_text
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_SUB
        p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 4: SCOPE OF THE PROJECT
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, 4, "Scope of the Project", "System boundaries, primary stakeholders, and architectural operational modules")
    add_footer(slide4)

    scopes = [
        ("Supermarket Donor Portal", "Selling & Redistribution", C_EMERALD, [
            "Continuous live camera video sampling with automatic steady hold capture.",
            "Visual CNN freshness score and blemish detection.",
            "Dual listing options: Flash discount sale (30%/50%/70%) or 100% free charity donation.",
            "Automatic EXIF geolocation stripping & cryptographic SHA-256 fingerprinting."
        ]),
        ("Charity & Shelter Marketplace", "Food Rescue & Claiming", C_BLUE, [
            "Publicly accessible catalog of verified fresh produce and surplus items.",
            "Instant reservation for charity shelters with tax exemption validation.",
            "Automated priority volunteer dispatch for urgent perishables.",
            "Role permissions: Donors cannot buy; Shelters cannot sell."
        ]),
        ("Shelf-Life & Cold-Chain Monitor", "Safety Operations", C_PURPLE, [
            "Real-time inventory triage sorted by urgency: Critical (<12h), Warning (12-36h), Safe (>36h).",
            "FSANZ Standard 1.2.5 regulatory temperature guidance lookup table.",
            "Cold-chain temperature logs and automatic markdown suggestion engine.",
            "Direct synchronization with MongoDB Atlas cloud persistence."
        ])
    ]

    for i, (s_title, s_sub, s_color, points) in enumerate(scopes):
        sx = Inches(0.8) + i * Inches(4.0)
        add_card(slide4, sx, Inches(1.8), Inches(3.7), Inches(4.8))

        tb = slide4.shapes.add_textbox(sx + Inches(0.25), Inches(2.0), Inches(3.2), Inches(4.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = s_title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = s_color

        p = tf.add_paragraph()
        p.text = s_sub
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_MUTED
        p.space_before = Pt(2)

        for pt in points:
            p = tf.add_paragraph()
            p.text = f"•  {pt}"
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = C_TEXT_DARK
            p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 5: OBJECTIVES
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, 5, "Project Objectives", "Concrete technical and societal milestones targeted by FreshGuard AI")
    add_footer(slide5)

    objs = [
        ("01", "Binary Freshness Classification", "Train and deploy a lightweight MobileNetV3 deep learning model that accurately classifies produce as 'Fresh / Good' vs 'Spoiled / Reject' in under 15 milliseconds.", C_EMERALD),
        ("02", "Dual-Validation Safety Matrix", "Combine computer vision inference with deterministic regulatory safety rules (FSANZ date markings, safe storage temperatures, package seal checks).", C_BLUE),
        ("03", "Hands-Free Auto-Scanning", "Implement continuous real-time video stream sampling (~250ms) with stability-based hands-free auto-capture to streamline retail store intake.", C_AMBER),
        ("04", "Cryptographic Data Integrity", "Enforce SHA-256 cryptographic image hashing to prevent image tampering and strip sensitive EXIF GPS metadata for tenant privacy.", C_PURPLE),
        ("05", "Multi-Tenant Cloud Platform", "Build a production React 19 and Express platform with strict role permissions connected live to a dedicated MongoDB Atlas cloud cluster.", C_EMERALD),
        ("06", "Food Waste & Hunger Reduction", "Provide a streamlined redistribution channel converting near-expiry supermarket surplus into nutritious meals for local shelters.", C_BLUE),
    ]

    for i, (num, h_text, d_text, color) in enumerate(objs):
        row = i // 3
        col = i % 3
        ox = Inches(0.8) + col * Inches(3.95)
        oy = Inches(1.8) + row * Inches(2.4)

        add_card(slide5, ox, oy, Inches(3.7), Inches(2.15))

        tb = slide5.shapes.add_textbox(ox + Inches(0.2), oy + Inches(0.15), Inches(3.3), Inches(1.85))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"OBJECTIVE {num}"
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = color

        p = tf.add_paragraph()
        p.text = h_text
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(3)

        p = tf.add_paragraph()
        p.text = d_text
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SUB
        p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 6: PROJECT MILESTONES (7 STAGES)
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, 6, "Project Milestones Overview", "High-level engineering milestones across the 26-week lifecycle")
    add_footer(slide6)

    milestones = [
        ("M1", "Requirement Analysis", "Define system boundaries, user stories, FSANZ regulatory rules, and schema models."),
        ("M2", "Dataset Preparation", "Gather 71k+ Kaggle produce images, conduct data augmentation, and sanitize EXIF data."),
        ("M3", "CNN Model Training", "Train MobileNetV3 binary classifier; achieve 96.2% validation accuracy with <15ms latency."),
        ("M4", "Full-Stack Development", "Build React 19 UI, Express 5 REST APIs, and MongoDB Atlas dedicated cluster connection."),
        ("M5", "Live Vision Integration", "Implement continuous canvas sampling, 1.5s stability hold-to-scan, and audio feedback."),
        ("M6", "Testing & Hardening", "Enforce strict role permissions, password encryption, and performance benchmarking."),
        ("M7", "Deployment & Pilot", "Deploy complete cloud architecture, conduct volunteer tracking, and finalize report.")
    ]

    card_m_w = Inches(1.58)
    card_m_h = Inches(4.6)
    for i, (m_code, m_title, m_desc) in enumerate(milestones):
        mx = Inches(0.8) + i * Inches(1.68)
        color = C_EMERALD if i < 5 else (C_AMBER if i == 5 else C_TEXT_MUTED)

        add_card(slide6, mx, Inches(1.9), card_m_w, card_m_h)

        tb = slide6.shapes.add_textbox(mx + Inches(0.12), Inches(2.05), card_m_w - Inches(0.24), card_m_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = m_code
        p.font.name = "Arial"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = color

        p = tf.add_paragraph()
        p.text = m_title
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK
        p.space_before = Pt(8)

        p = tf.add_paragraph()
        p.text = m_desc
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SUB
        p.space_before = Pt(8)

        status_txt = "COMPLETED" if i < 5 else ("IN PROGRESS" if i == 5 else "PLANNED")
        p = tf.add_paragraph()
        p.text = status_txt
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_before = Pt(14)

    # =========================================================================
    # SLIDE 7: COMPLETED MILESTONES (MID-PROGRESS STATUS ~85%)
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, 7, "Completed Milestones & Mid Progress", "Current system maturity evaluated at ~85% total completion")
    add_footer(slide7)

    # Left Highlight Box (Large 85% stat)
    add_card(slide7, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8), bg_color=C_DARK_BG, border_color=None)
    stat_tb = slide7.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(3.2), Inches(4.0))
    tf = stat_tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "OVERALL STATUS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_MINT

    p = tf.add_paragraph()
    p.text = "85%"
    p.font.name = "Arial"
    p.font.size = Pt(56)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_before = Pt(6)

    p = tf.add_paragraph()
    p.text = "System Fully Functional\nEnd-to-End Live Pipeline"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(4)

    p = tf.add_paragraph()
    p.text = "• AI Microservice: Operational\n• Real-Time Vision HUD: Active\n• MongoDB Atlas Cluster: Live\n• Multi-Tenant Security: Verified"
    p.font.name = "Arial"
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_MINT
    p.space_before = Pt(16)

    # Right 4 Detailed Milestone Progress Cards
    m_done = [
        ("Requirement Analysis & Specification", "COMPLETED • 100%", C_EMERALD, "Defined business flows, FSANZ safe storage limits, cold-chain temperature thresholds, and 4-tier system architecture."),
        ("AI Vision Lens & MobileNetV3 Classifier", "COMPLETED • 100%", C_EMERALD, "Binary model trained to 96.2% validation accuracy. Fast optical camera intake with hands-free auto-capture and telemetry HUD."),
        ("Cloud Database & Multi-Tenant Platform", "COMPLETED • 100%", C_EMERALD, "Connected live to MongoDB Atlas cluster0. Zero local storage leakage; strict role permissions (Donors sell, Shelters claim)."),
        ("Delivery Routing & Volunteer Tracking", "IN PROGRESS • 45%", C_AMBER, "Core delivery confirmation active. Finalizing live GPS route optimization and automated push notifications for shelters.")
    ]

    for i, (m_h, m_badge, m_color, m_det) in enumerate(m_done):
        cy = Inches(1.8) + i * Inches(1.18)
        add_card(slide7, Inches(4.7), cy, Inches(7.8), Inches(1.05))

        tb = slide7.shapes.add_textbox(Inches(4.9), cy + Inches(0.1), Inches(7.4), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"{m_h}  —  "
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK

        run = p.add_run()
        run.text = m_badge
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = m_color

        p = tf.add_paragraph()
        p.text = m_det
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SUB
        p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 8: SYSTEM ARCHITECTURE
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, 8, "4-Tier System Architecture", "End-to-end data flow from optical lens to distributed cloud storage")
    add_footer(slide8)

    tiers = [
        ("TIER 1: PRESENTATION & CLIENT LAYER", C_EMERALD, [
            "React 19 + TypeScript Single Page Application (SPA)",
            "HTML5 Canvas Optical Sampler (~250ms interval)",
            "Hands-Free Auto-Capture with Web Audio API chime",
            "Role-specific UI views for Supermarket Donors, Charities, and Retail Shoppers"
        ]),
        ("TIER 2: APPLICATION & AI MICROSERVICES", C_BLUE, [
            "FastAPI Python Microservice (Port 8000) running MobileNetV3 binary inference",
            "Express.js Enterprise REST API (Port 5000) managing transactions and sessions",
            "FSANZ Standard 1.2.5 Rule Engine calculating real-time safety indices"
        ]),
        ("TIER 3: SECURITY & DATA PRIVACY LAYER", C_PURPLE, [
            "Client-Side EXIF Metadata Stripping to protect store GPS locations",
            "SHA-256 Cryptographic Image Hashing for tamper-evident audit trails",
            "Isolated Multi-Tenant Architecture with zero cross-tenant credential leakage"
        ]),
        ("TIER 4: DISTRIBUTED CLOUD PERSISTENCE", C_AMBER, [
            "MongoDB Atlas Dedicated Cloud Replica Set (Cluster0)",
            "Mongoose Schemas: products, users, orders, audit_ledger",
            "Real-Time Database Queries for live shelf-life and delivery metrics"
        ])
    ]

    for i, (tier_h, tier_color, pts) in enumerate(tiers):
        ty = Inches(1.8) + i * Inches(1.22)
        add_card(slide8, Inches(0.8), ty, Inches(11.733), Inches(1.1))

        tb = slide8.shapes.add_textbox(Inches(1.0), ty + Inches(0.12), Inches(11.3), Inches(0.88))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = tier_h
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = tier_color

        p = tf.add_paragraph()
        p.text = "   •   ".join(pts)
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SUB
        p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 9: METHODOLOGY & INTAKE PIPELINE
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, 9, "Methodology & Inspection Pipeline", "5-stage scientific evaluation workflow combining neural vision with regulatory rules")
    add_footer(slide9)

    steps = [
        ("Step 1: Optical Intake", "Camera video feed samples 240x180 center-cropped frames. Evaluates optical focus and frame-to-frame stability delta (<10.5).", C_EMERALD),
        ("Step 2: Hands-Free Lock", "Holding specimen steady for 1.5s fills circular countdown reticle, triggers synthetic audio beep, and captures high-res JPEG.", C_BLUE),
        ("Step 3: Neural & Rule Audit", "MobileNetV3 generates visual confidence score while deterministic matrix validates FSANZ temp & expiry date markings.", C_PURPLE),
        ("Step 4: Cryptographic Seal", "EXIF metadata is stripped for location privacy; SHA-256 hash is computed and stored in the tamper-evident audit ledger.", C_AMBER),
        ("Step 5: Dynamic Listing", "Approved items branch into clearance discount sale (30%-70%) or free charity donation; spoiled items are locked from sale.", C_EMERALD)
    ]

    for i, (s_title, s_desc, s_color) in enumerate(steps):
        sy = Inches(1.8) + i * Inches(0.98)
        add_card(slide9, Inches(0.8), sy, Inches(11.733), Inches(0.88))

        tb = slide9.shapes.add_textbox(Inches(1.1), sy + Inches(0.12), Inches(11.1), Inches(0.68))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"{s_title} — "
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = s_color

        run = p.add_run()
        run.text = s_desc
        run.font.size = Pt(10)
        run.font.bold = False
        run.font.color.rgb = C_TEXT_SUB

    # =========================================================================
    # SLIDE 10: TECHNOLOGY STACK
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, 10, "Technology Stack & Tools", "Production-grade frameworks chosen for latency, security, and scalability")
    add_footer(slide10)

    techs = [
        ("Frontend & User Interface", C_EMERALD, [
            ("React 19 & TypeScript", "Component-driven reactive architecture with full type safety."),
            ("Tailwind CSS", "Enterprise Shadcn-style design system with clean minimalist styling."),
            ("HTML5 Canvas & Web Audio API", "Real-time client-side frame sampler and audio shutter feedback.")
        ]),
        ("Machine Learning & AI", C_BLUE, [
            ("MobileNetV3 (TensorFlow/Keras)", "Lightweight CNN with depthwise separable convolutions (<15ms latency)."),
            ("FastAPI Microservice", "Asynchronous Python REST API serving neural inference on port 8000."),
            ("OpenCV & Pillow", "High-performance image normalization, resizing, and center cropping.")
        ]),
        ("Backend & Business Logic", C_PURPLE, [
            ("Express.js 5.0 REST Server", "Scalable backend orchestrating orders, intake, and authentication."),
            ("Node.js Crypto API", "SHA-256 hashing and secure credential verification."),
            ("Role Permission Middleware", "Strict tenant access controls preventing unauthorized cross-actions.")
        ]),
        ("Database & Security", C_AMBER, [
            ("MongoDB Atlas Cloud Cluster", "Dedicated replica set with users, products, orders, and ledger collections."),
            ("Mongoose ODM", "Strict document schemas, validations, and timestamps."),
            ("TLS 1.3 & AES-256", "End-to-end transit encryption and sensitive data protection at rest.")
        ])
    ]

    for i, (t_title, t_color, t_items) in enumerate(techs):
        row = i // 2
        col = i % 2
        tx = Inches(0.8) + col * Inches(5.9)
        ty = Inches(1.8) + row * Inches(2.4)

        add_card(slide10, tx, ty, Inches(5.6), Inches(2.2))

        tb = slide10.shapes.add_textbox(tx + Inches(0.25), ty + Inches(0.18), Inches(5.1), Inches(1.85))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = t_title
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = t_color

        for item_h, item_d in t_items:
            p = tf.add_paragraph()
            p.text = f"• {item_h}: "
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.bold = True
            p.font.color.rgb = C_TEXT_DARK
            p.space_before = Pt(3)

            run = p.add_run()
            run.text = item_d
            run.font.bold = False
            run.font.color.rgb = C_TEXT_SUB

    # =========================================================================
    # SLIDE 11: IMPLEMENTATION TIMELINE & GANTT SCHEDULE
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, 11, "Project Implementation Timeline", "26-week milestone schedule tracking completed and remaining phases")
    add_footer(slide11)

    phases = [
        ("Phase 1: Research & Planning", "Weeks 1–4", "COMPLETED", C_EMERALD, "Collected Kaggle datasets, defined FSANZ standards, drafted system architecture."),
        ("Phase 2: AI Model Development", "Weeks 5–11", "COMPLETED", C_EMERALD, "Trained MobileNetV3 binary classifier, tuned hyperparameters, achieved 96.2% accuracy."),
        ("Phase 3: Rule System & Security", "Weeks 12–16", "COMPLETED", C_EMERALD, "Engineered deterministic FSANZ validation, SHA-256 hashing, and EXIF sanitization."),
        ("Phase 4: Full-Stack Integration", "Weeks 17–21", "COMPLETED", C_EMERALD, "Built React 19 UI, connected live MongoDB Atlas cluster, built live vision lens."),
        ("Phase 5: Field Testing & Final Report", "Weeks 22–26", "IN PROGRESS", C_AMBER, "Pilot volunteer route tracking, load testing, final report, and documentation.")
    ]

    for i, (p_name, p_weeks, p_status, p_color, p_desc) in enumerate(phases):
        py = Inches(1.8) + i * Inches(0.98)
        add_card(slide11, Inches(0.8), py, Inches(11.733), Inches(0.88))

        tb = slide11.shapes.add_textbox(Inches(1.1), py + Inches(0.12), Inches(11.1), Inches(0.68))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"{p_name}  ({p_weeks})  —  "
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK

        run = p.add_run()
        run.text = f"[{p_status}]"
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = p_color

        p = tf.add_paragraph()
        p.text = p_desc
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_SUB
        p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 12: TECHNICAL CHALLENGES & ENGINEERING SOLUTIONS
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, 12, "Challenges Encountered & Solutions", "Key technical obstacles resolved during the implementation phase")
    add_footer(slide12)

    challenges = [
        ("Heavy Model Latency on Low-End Workstations",
         "Initial deep CNN models caused high CPU inference delays (>150ms per frame), making live camera interaction laggy.",
         "Replaced heavy multi-class models with a pruned binary MobileNetV3 architecture, slashing inference time to <15ms with 96.2% accuracy.",
         C_EMERALD),
        ("Shaky Webcam Frames Causing False Spoilage",
         "Hand tremors and motion blur caused false discoloration readings and erratic classification swings.",
         "Engineered an automated 1.5s stability hold-to-scan engine with a circular countdown and frame delta threshold before capturing.",
         C_BLUE),
        ("Public Directory Exposing Confidential Corporate Data",
         "The initial account directory exposed all registered stores' emails and business license IDs publicly.",
         "Redesigned the module into an isolated 'My Organization' portal where users view only their verified credentials and real operational stats.",
         C_PURPLE),
        ("Browser Autofill Injecting Stale Credentials",
         "Browsers automatically injected saved passwords and placeholder emails into the registration form.",
         "Enforced autoComplete='off' and autoComplete='new-password' with completely blank state defaults and defensive sanitization.",
         C_AMBER)
    ]

    for i, (c_title, c_prob, c_sol, c_color) in enumerate(challenges):
        row = i // 2
        col = i % 2
        cx = Inches(0.8) + col * Inches(5.9)
        cy = Inches(1.8) + row * Inches(2.4)

        add_card(slide12, cx, cy, Inches(5.6), Inches(2.2))

        tb = slide12.shapes.add_textbox(cx + Inches(0.22), cy + Inches(0.15), Inches(5.15), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = c_title
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = c_color

        p = tf.add_paragraph()
        p.text = f"Problem: {c_prob}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = RGBColor(185, 28, 28) # Red 700
        p.space_before = Pt(3)

        p = tf.add_paragraph()
        p.text = f"Solution: {c_sol}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_EMERALD
        p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 13: DEMONSTRATION & CORE USER WORKFLOWS
    # =========================================================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_header(slide13, 13, "System Demonstration & Workflows", "Live walkthrough of the 4 core operational modules")
    add_footer(slide13)

    demos = [
        ("01. Secure Auth Gateway", "Role-Gated Access", C_EMERALD, [
            "Default clean registration form with blank inputs.",
            "Enforces strict role permissions upon login.",
            "Password hashing and cloud session management."
        ]),
        ("02. Live Camera Scanner", "Hands-Free Auto-Capture", C_BLUE, [
            "Continuous 250ms optical sampling HUD.",
            "Hold steady for 1.5s to trigger auto-lock & audio chime.",
            "Sanitizes EXIF GPS metadata & generates SHA-256 hash."
        ]),
        ("03. Dual-Branch Marketplace", "Claim or Purchase", C_PURPLE, [
            "Donors restricted to selling mode only.",
            "Charities claim free shelter donations instantly.",
            "Retail shoppers purchase discount clearance items."
        ]),
        ("04. Shelf-Life Monitor", "Cold-Chain & Triage", C_AMBER, [
            "Urgency triage: Critical (<12h), Warning, and Safe.",
            "FSANZ storage temperature reference lookup.",
            "Real-time operational metrics fetched live from Atlas."
        ])
    ]

    for i, (d_h, d_sub, d_color, d_pts) in enumerate(demos):
        dx = Inches(0.8) + i * Inches(2.95)
        add_card(slide13, dx, Inches(1.8), Inches(2.75), Inches(4.8))

        tb = slide13.shapes.add_textbox(dx + Inches(0.18), Inches(2.0), Inches(2.4), Inches(4.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = d_h
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = d_color

        p = tf.add_paragraph()
        p.text = d_sub
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_MUTED
        p.space_before = Pt(2)

        for pt in d_pts:
            p = tf.add_paragraph()
            p.text = f"• {pt}"
            p.font.name = "Arial"
            p.font.size = Pt(9.5)
            p.font.color.rgb = C_TEXT_DARK
            p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 14: REMAINING WORK
    # =========================================================================
    slide14 = prs.slides.add_slide(blank_layout)
    add_header(slide14, 14, "Remaining Work & Future Roadmap", "Planned enhancements towards final evaluation and deployment")
    add_footer(slide14)

    remains = [
        ("01", "Volunteer Logistics & GPS Route Tracking", "Develop real-time GPS courier routing and estimated arrival calculation for shelter donation pickups.", C_EMERALD),
        ("02", "Automated Push Notification Dispatch", "Implement WebSocket / WebPush alerts notifying local charities immediately when perishable items enter critical shelf-life (<12h).", C_BLUE),
        ("03", "Multi-Commodity Dataset Expansion", "Expand the CNN model training dataset to recognize packaged bakery goods, dairy products, and prepared hot meals.", C_PURPLE),
        ("04", "Comprehensive Field Testing & Final Report", "Execute multi-user stress testing, conduct grocery store field trials, and complete the final project report.", C_AMBER)
    ]

    for i, (r_num, r_h, r_d, r_color) in enumerate(remains):
        ry = Inches(1.8) + i * Inches(1.22)
        add_card(slide14, Inches(0.8), ry, Inches(11.733), Inches(1.1))

        tb = slide14.shapes.add_textbox(Inches(1.1), ry + Inches(0.15), Inches(11.1), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"TASK {r_num}: {r_h}  "
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = r_color

        p = tf.add_paragraph()
        p.text = r_d
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_SUB
        p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 15: CONCLUSION & THANK YOU
    # =========================================================================
    slide15 = prs.slides.add_slide(blank_layout)
    bg15 = slide15.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg15.fill.solid()
    bg15.fill.fore_color.rgb = C_DARK_BG
    bg15.line.fill.background()

    # Center Card
    center_card = slide15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(1.2), Inches(8.933), Inches(5.1))
    center_card.fill.solid()
    center_card.fill.fore_color.rgb = RGBColor(30, 41, 59) # Slate 800
    center_card.line.color.rgb = RGBColor(51, 65, 85)
    center_card.line.width = Pt(1)

    tb15 = slide15.shapes.add_textbox(Inches(2.5), Inches(1.6), Inches(8.333), Inches(4.3))
    tf15 = tb15.text_frame
    tf15.word_wrap = True

    p = tf15.paragraphs[0]
    p.text = "THANK YOU!"
    p.alignment = PP_ALIGN.CENTER
    p.font.name = "Arial"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = C_MINT

    p = tf15.add_paragraph()
    p.text = "Questions & Discussion"
    p.alignment = PP_ALIGN.CENTER
    p.font.name = "Arial"
    p.font.size = Pt(20)
    p.font.color.rgb = C_WHITE
    p.space_before = Pt(8)

    p = tf15.add_paragraph()
    p.text = "FreshGuard AI: AI-Driven Food Freshness Detection & Zero-Waste Redistribution"
    p.alignment = PP_ALIGN.CENTER
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(16)

    p = tf15.add_paragraph()
    p.text = "CO3554 – Data Management Project  •  Mid Progress Presentation\nVidsaran Sivapatham  (21/ENG/116)\nFaculty of Engineering"
    p.alignment = PP_ALIGN.CENTER
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_before = Pt(14)

    # Save Presentation to Data_Management directory
    out_path_local = r"c:\Users\LENOVO\Documents\Data_Management\FreshGuard_AI_Mid_Progress_Presentation.pptx"
    prs.save(out_path_local)
    print(f"Presentation saved successfully to: {out_path_local}")

    # Copy to Downloads directory as requested
    out_path_downloads = r"c:\Users\LENOVO\Downloads\FreshGuard_AI_Mid_Progress_Presentation.pptx"
    try:
        shutil.copy2(out_path_local, out_path_downloads)
        print(f"Presentation copied to Downloads: {out_path_downloads}")
    except Exception as e:
        print(f"Could not copy to Downloads: {e}")

if __name__ == "__main__":
    create_deck()

