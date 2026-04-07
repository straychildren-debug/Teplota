from PIL import Image
import os

# Full design screenshot path
design_img_path = 'design_assets/Сайт Теплота2.png'
assets_dir = 'assets'

def crop_asset(left, top, right, bottom, name):
    with Image.open(design_img_path) as img:
        cropped = img.crop((left, top, right, bottom))
        cropped.save(os.path.join(assets_dir, name))
        print(f'Cropped and saved {name}')

if __name__ == '__main__':
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)

    # Note: Coordinates are estimates based on 1920px width and visual analysis
    # Adjusting for products grid
    # Products section starts around 4050px in the layout
    # Row 1
    crop_asset(320, 4100, 680, 4550, 'product_1.png')
    crop_asset(700, 4100, 1060, 4550, 'product_2.png')
    crop_asset(1080, 4100, 1440, 4550, 'product_3.png')
    crop_asset(1460, 4100, 1820, 4550, 'product_4.png')
    
    # Row 2
    crop_asset(320, 4600, 680, 5050, 'product_5.png')
    crop_asset(700, 4600, 1060, 5050, 'product_6.png')
    crop_asset(1080, 4600, 1440, 5050, 'product_7.png')
    crop_asset(1460, 4600, 1820, 5050, 'product_8.png')

    # Brand logos (Stout, Rommer, Arrowhead) - Around 1100px to 1500px in the design
    crop_asset(380, 1370, 500, 1430, 'brand_stout.png')
    crop_asset(530, 1370, 750, 1430, 'brand_arrow.png')
    crop_asset(780, 1370, 930, 1430, 'brand_rommer.png')

    # Map (Bottom)
    crop_asset(0, 6600, 1920, 7557, 'map_full.png')
