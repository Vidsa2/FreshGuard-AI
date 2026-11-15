import pypdf

def dump_pdf(path, out_txt):
    reader = pypdf.PdfReader(path)
    with open(out_txt, "w", encoding="utf-8") as out:
        for i, page in enumerate(reader.pages):
            out.write(f"\n--- PAGE {i+1} ---\n")
            out.write(page.extract_text() or "")

try:
    dump_pdf(r"C:\Users\LENOVO\Downloads\22ENG008_EduEats_Mid_Progress_Report.pdf", r"C:\Users\LENOVO\Documents\Data_Management\edueats_report.txt")
    dump_pdf(r"C:\Users\LENOVO\Downloads\22_ENG_133_CO3554_Mid-Term_Progress_Report.pdf", r"C:\Users\LENOVO\Documents\Data_Management\cosmetic_report.txt")
    print("Extracted both PDFs successfully!")
except Exception as e:
    print(f"Error: {e}")
