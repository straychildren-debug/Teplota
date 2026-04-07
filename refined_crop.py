from PIL import Image
import os

# Full design screenshot path
design_img_path = 'design_assets/Сайт Теплота2.png'
assets_dir = 'assets'

def crop_asset(left, top, right, bottom, name):
    with Image.open(design_img_path) as img:
        # Increase quality by taking more precise center
        cropped = img.crop((left, top, right, bottom))
        # Ensure we have just the content (remove any stray edges)
        # Background of cards is a specific dark color, we want just the png transparency if possible?
        # No, we just need the product photo.
        cropped.save(os.path.join(assets_dir, f'clean_{name}'))
        print(f'Cropped and saved CLEAN_{name}')

if __name__ == '__main__':
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)

    # REFINED COORDINATES for Products (central part only)
    # y=4050 (start of section)
    # y=4100 (start of card content) 
    # Row 1 (y: 4100-4435)
    # Card width 340, gutter ~40.
    # Cards: 320, 700, 1080, 1460 (left edge)
    
    # Inner image rect is 250x118, y offset is ~50 inside card
    # y range for image: 4150 to 4268 (approx)
    
    # Row 1
    crop_asset(365, 4150, 615, 4270, 'product_1.png')
    crop_asset(745, 4150, 995, 4270, 'product_2.png')
    crop_asset(1125, 4150, 1375, 4270, 'product_3.png')
    crop_asset(1505, 4150, 1755, 4270, 'product_4.png')
    
    # Row 2 (y starts around 4600 in original cards)
    # Cards: 320, 700, 1080, 1460 
    # y range for image: 4650 to 4768
    crop_asset(365, 4650, 615, 4770, 'product_5.png')
    crop_asset(745, 4650, 995, 4770, 'product_6.png')
    crop_asset(1125, 4650, 1375, 4770, 'product_7.png')
    crop_asset(1505, 4650, 1755, 4770, 'product_8.png')
