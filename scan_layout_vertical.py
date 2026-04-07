from PIL import Image
import os

design_img_path = 'design_assets/Сайт Теплота2.png'

def scan_rows():
    with Image.open(design_img_path) as img:
        img_rgb = img.convert('RGB')
        width, height = img.size
        
        # Scan every 50 pixels for vertical structure
        for y in range(0, height, 100):
            pixels = [img_rgb.getpixel((x, y)) for x in range(0, width, 50)]
            # Dark color check (#141414)
            dark_count = sum(1 for p in pixels if p[0] < 50 and p[1] < 50 and p[2] < 50)
            white_count = sum(1 for p in pixels if p[0] > 240 and p[1] > 240 and p[2] > 240)
            
            print(f"y={y:4} | Dark={dark_count:2} | White={white_count:2}")

if __name__ == '__main__':
    scan_rows()
