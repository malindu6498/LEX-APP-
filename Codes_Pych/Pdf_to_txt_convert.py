import os
import fitz  # PyMuPDF library for handling PDFs

# 1. Define input and output directories
# Replace these paths with your actual folder paths
pdf_directory = r"D:\llm project\txt data\pdf"
txt_directory = r"D:\llm project\txt data"

# 2. Create the output directory if it doesn't exist
os.makedirs(txt_directory, exist_ok=True)

print("Starting PDF to TXT conversion...")

# 3. Loop through all files in the PDF directory
for filename in os.listdir(pdf_directory):
    if filename.lower().endswith(".pdf"):
        pdf_path = os.path.join(pdf_directory, filename)

        # Create a corresponding .txt filename
        txt_filename = filename.replace(".pdf", ".txt").replace(".PDF", ".txt")
        txt_path = os.path.join(txt_directory, txt_filename)

        try:
            # 4. Open the PDF file
            doc = fitz.open(pdf_path)
            extracted_text = ""

            # 5. Extract text from each page
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # Adding a newline after each page to maintain structure
                extracted_text += page.get_text("text") + "\n\n"

                # 6. Save the extracted text to a .txt file
            with open(txt_path, "w", encoding="utf-8") as txt_file:
                txt_file.write(extracted_text)

            print(f"Successfully converted: {filename}")

        except Exception as e:
            print(f"Failed to convert {filename}. Error: {e}")

print("\nAll PDF files have been processed and saved as TXT files!")