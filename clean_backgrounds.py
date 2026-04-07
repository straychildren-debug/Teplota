from PIL import Image, ImageDraw
import os

assets_dir = 'assets'
product_files = [f'product_{i}.png' for i in range(1, 9)]

def flood_fill_background(filename):
    file_path = os.path.join(assets_dir, filename)
    if not os.path.exists(file_path):
        print(f"Skipping {filename}: not found.")
        return

    try:
        img = Image.open(file_path).convert("RGBA")
        width, height = img.size
        
        # We'll use a mask to track what's background
        # Seed points: the four corners
        seeds = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
        
        # Color to replace: White (255, 255, 255)
        # We need a tolerance. Floodfill in Pillow doesn't have tolerance built-in easily
        # but we can pre-process to make background uniform white first or use a custom fill
        
        # Strategy: 
        # 1. Any pixel very close to white in the border is definitely background.
        # 2. We'll flood fill from corners on a "white mask".
        
        # Create a 1-bit mask where 1 is "near white"
        mask = Image.new('L', (width, height), 0)
        pixels = img.load()
        mask_pixels = mask.load()
        
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if r > 240 and g > 240 and b > 240:
                    mask_pixels[x, y] = 255
        
        # Now flood fill the MASK starting from corners
        # This identifies the "outer white area"
        for seed in seeds:
            if mask.getpixel(seed) == 255:
                ImageDraw.floodfill(mask, seed, 128) # 128 = "Outer Background"
        
        # Now apply the mask to the original image
        new_data = []
        mask_data = list(mask.getdata())
        orig_data = list(img.getdata())
        
        for i in range(len(orig_data)):
            if mask_data[i] == 128: # It's part of the outer background
                new_data.append((255, 255, 255, 0)) # Transparent
            else:
                new_data.append(orig_data[i])
        
        img.putdata(new_data)
        img.save(file_path, "PNG")
        print(f"Cleaned {filename} using Flood-Fill.")
        
    except Exception as e:
        print(f"Error cleaning {filename}: {e}")

if __name__ == '__main__':
    for f in product_files:
        flood_fill_background(f)
