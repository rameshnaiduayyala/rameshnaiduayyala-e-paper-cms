import sys
from pdf2image import convert_from_path

pdf_path = sys.argv[1]
out_dir = sys.argv[2]
base_name = sys.argv[3]

# Convert PDF → JPEGs
images = convert_from_path(pdf_path, dpi=300, fmt="jpeg", output_folder=out_dir, output_file=base_name)

print(f"Converted {len(images)} pages")
