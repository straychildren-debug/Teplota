from PIL import Image, ImageDraw
import os

design_img_path = 'design_assets/Сайт Теплота2.png'
assets_dir = 'assets'

def find_refined_products():
    with Image.open(design_img_path) as full_img:
        full_img_rgb = full_img.convert('RGB')
        width, height = full_img.size
        
        # WE ALREADY KNOW Y-SECTION (from previous scans and Figma)
        # y=4100 is roughly row 1 image area
        # ROW 1 (y: 4100-4350)
        # ROW 2 (y: 4600-4850)
        
        # We'll use a sliding window for X
        # Looking for clusters of non-white pixels (the products)
        # 4 products across. x offsets starting after x=250.
        
        def crop_p(name, x, y, w, h):
            crop = full_img.crop((x, y, x+w, y+h))
            crop = crop.convert("RGBA")
            
            # Corner Flood-Fill to remove background
            ImageDraw.floodfill(crop, (0, 0), (255, 255, 255, 0))
            ImageDraw.floodfill(crop, (w-1, 0), (255, 255, 255, 0))
            
            crop.save(os.path.join(assets_dir, name))
            print(f"Reconciled {name}")

        # REFINED X/Y COORDINATES (for 1920px artboard)
        # Cards are spaced across ~1400px
        # (310, 670, 1030, 1390)
        
        y1 = 4120
        h = 200
        w = 300
        crop_p('product_1.png', 320, y1, w, h)
        crop_p('product_2.png', 680, y1, w, h)
        crop_p('product_3.png', 1040, y1, w, h)
        crop_p('product_4.png', 1400, y1, w, h)
        
        y2 = 4620
        crop_p('product_5.png', 320, y2, w, h)
        crop_p('product_6.png', 680, y2, w, h)
        crop_p('product_7.png', 1040, y2, w, h)
        crop_p('product_8.png', 1400, y2, w, h)

if __name__ == '__main__':
    find_refined_products()
