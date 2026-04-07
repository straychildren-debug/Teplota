from PIL import Image, ImageOps, ImageDraw
import os

design_img_path = 'design_assets/Сайт Теплота2.png'
assets_dir = 'assets'

def process_brand(img, x, y, w, h, name):
    # Crop the brand logo from a white-background screenshot
    crop = img.crop((x, y, x+w, y+h))
    
    # Process for dark theme:
    # 1. Convert to RGBA
    crop = crop.convert("RGBA")
    
    # 2. Flood fill corner transparency (remove outer white)
    width, height = crop.size
    ImageDraw.floodfill(crop, (0, 0), (255, 255, 255, 0))
    ImageDraw.floodfill(crop, (width-1, 0), (255, 255, 255, 0))
    
    # 3. Intelligent Inversion:
    # If a pixel is very dark (black/gray), make it white.
    # If a pixel has saturation (like Stout Red), keep its hue but maybe brighten it.
    
    data = list(crop.getdata())
    new_data = []
    for item in data:
        r, g, b, a = item
        if a == 0:
            new_data.append(item)
            continue
            
        # Is it dark/gray? (low saturation)
        # We'll just simplify: if R, G, B are all < 100, make them white.
        if r < 100 and g < 100 and b < 100:
            new_data.append((240, 240, 240, 255))
        else:
            # Keep original (Red Stout logo, etc.)
            new_data.append(item)
            
    crop.putdata(new_data)
    crop.save(os.path.join(assets_dir, name))
    print(f"Reconciled {name}")

if __name__ == '__main__':
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        
    with Image.open(design_img_path) as full_img:
        # SCAN for brands in the 1200-1500 range
        # Coordinates based on more precise visual matching ofArtboard structure (1920px)
        # Stout, Arrow, Rommer
        # y is around 1250-1300
        y_anchor = 1260
        process_brand(full_img, 240, y_anchor, 200, 80, 'brand_stout.png')
        process_brand(full_img, 460, y_anchor, 200, 80, 'brand_arrow.png')
        process_brand(full_img, 700, y_anchor, 200, 80, 'brand_rommer.png')
