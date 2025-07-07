import os
import sys

def clean_csv(input_filepath, output_filepath=None):
    """
    Clean a CSV file by removing comment lines and fixing JSON formatting issues.
    
    Args:
        input_filepath: Path to the input CSV file
        output_filepath: Path to save the cleaned CSV file (optional)
    
    Returns:
        Path to the cleaned CSV file
    """
    if not os.path.exists(input_filepath):
        print(f"Error: Input file {input_filepath} does not exist")
        return None
    
    if output_filepath is None:
        base_dir = os.path.dirname(input_filepath)
        filename = os.path.basename(input_filepath)
        name, ext = os.path.splitext(filename)
        output_filepath = os.path.join(base_dir, f"{name}_clean{ext}")
    
    try:
        with open(input_filepath, 'r', encoding='utf-8') as input_file:
            lines = input_file.readlines()
        
        # Find the header line (first line without // comments)
        header_index = 0
        for i, line in enumerate(lines):
            if not line.strip().startswith('//'):
                header_index = i
                break
        
        # Extract header and data
        header = lines[header_index].strip()
        data_lines = [line.strip() for line in lines[header_index+1:] if line.strip() and not line.strip().startswith('//')]
        
        # Clean each line, removing extra spaces in JSON parts and fixing trailing commas
        cleaned_data = []
        for line in data_lines:
            # Clean trailing spaces at the ends of fields
            line = line.replace(', ', ',')
            # Fix repeated commas
            while ',,' in line:
                line = line.replace(',,', ',')
            # Make sure the line doesn't end with a comma
            if line.endswith(','):
                line = line[:-1]
            cleaned_data.append(line)
        
        # Write the cleaned file
        with open(output_filepath, 'w', encoding='utf-8') as output_file:
            output_file.write(header + '\n')
            output_file.write('\n'.join(cleaned_data))
        
        print(f"Cleaned CSV file saved to {output_filepath}")
        return output_filepath
    
    except Exception as e:
        print(f"Error cleaning CSV file: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python clean_csv.py input_file.csv [output_file.csv]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    clean_csv(input_file, output_file)
