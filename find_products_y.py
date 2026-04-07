from PIL import Image, ImageDraw
import os

design_img_path = 'design_assets/Сайт Теплота2.png'

def find_sections():
    with Image.open(design_img_path) as img:
        img_rgb = img.convert('RGB')
        width, height = img.size
        
        # Scan vertical for the text "НАШИ ТОВАРЫ" or similar?
        # No, I'll just look for a grid of 4x2 dark rectangles (#141414).
        
        # Starting scan from y=3500 downwards
        for y in range(3500, 5500, 10):
            # Check a row
            pixels = [img_rgb.getpixel((x, y)) for x in range(0, width, 50)]
            # If many pixels are very dark (#141414 is (20, 20, 20))
            dark_count = sum(1 for p in pixels if p[0] < 30 and p[1] < 30 and p[2] < 30)
            if dark_count > 15:
                print(f"Potential Products Section Start at y={y}")
                break

if __name__ == '__main__':
    find_sections()
