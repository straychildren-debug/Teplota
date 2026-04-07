from PIL import Image, ImageDraw
import os

design_img_path = 'design_assets/Сайт Теплота2.png'
assets_dir = 'assets'

def find_refined_services():
    with Image.open(design_img_path) as full_img:
        full_img_rgb = full_img.convert('RGB')
        width, height = full_img.size
        
        def crop_s(name, x, y, w, h):
            crop = full_img.crop((x, y, x+w, y+h))
            # Services are full photos, usually don't need background removal
            # but we'll crop them cleanly.
            crop.save(os.path.join(assets_dir, name))
            print(f"Reconciled {name}")

        # Services Row
        # y=550 to 800 approx
        y_s = 560
        h = 240
        w = 320
        # 5 services
        crop_s('service_1.png', 40, y_s, w, h)
        crop_p_x = 40 + w + 20
        crop_s('service_2.png', 410, y_s, w, h)
        crop_s('service_3.png', 780, y_s, w, h)
        crop_s('service_4.png', 1150, y_s, w, h)
        crop_s('service_5.png', 1520, y_s, w, h)

if __name__ == '__main__':
    find_refined_services()
