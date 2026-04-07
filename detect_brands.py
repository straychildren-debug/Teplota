from PIL import Image, ImageOps
import os

design_img_path = 'design_assets/Сайт Теплота2.png'

def find_brands_and_fix():
    with Image.open(design_img_path) as img:
        img_rgb = img.convert('RGB')
        width, height = img.size
        
        # We're looking for 3 elements in a row that are NOT solid background
        # Usually brands are in the middle (x=300 to 1600)
        # Scan y from 800 to 3000
        for y in range(800, 3000, 50):
            row_pixels = [img_rgb.getpixel((x, y)) for x in range(200, width-200, 50)]
            # If we find a row that has non-white pixels (assuming light mode screenshot)
            non_white = sum(1 for p in row_pixels if p[0] < 240 or p[1] < 240 or p[2] < 240)
            if non_white > 5:
                # Potential brand row!
                # Crop a larger area to see
                print(f"Detected potential brand area at y={y}")
                # We'll crop around y-50 to y+50
                # And save as a temporary debug image
                brand_row = img.crop((0, y-50, width, y+50))
                
                # Invert if it's light mode to fit the dark theme
                # Actually, brands like Stout (Red) should stay red. 
                # Only white/black should be handled.
                
                # We'll save the 3 brands based on x-offsets
                # Based on previous refined_crop: [380, 530, 780]
                brand_row.save('assets/detected_brands.png')
                break

if __name__ == '__main__':
    find_brands_and_fix()
