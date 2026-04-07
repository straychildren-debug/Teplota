from PIL import Image
import os

assets_dir = 'assets'
product_files = [f'product_{i}.png' for i in range(1, 9)]

def remove_white_background(filename):
    file_path = os.path.join(assets_dir, filename)
    if not os.path.exists(file_path):
        print(f"Skipping {filename}: not found.")
        return

    try:
        img = Image.open(file_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is white or very close to white (allow some tolerance)
            # R, G, B > 245
            if item[0] > 245 and item[1] > 245 and item[2] > 245:
                # Make it transparent
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(file_path, "PNG")
        print(f"Processed {filename}: background removed.")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

if __name__ == '__main__':
    for product_file in product_files:
        remove_white_background(product_file)
