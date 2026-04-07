import requests
import json
import os
import time

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'

ASSET_MAP = {
    'logo.svg': '619:1127',
    'service_1.png': 'I251:398;35:375',
    'service_2.png': 'I251:399;35:375',
    'service_3.png': 'I251:400;35:375',
    'service_4.png': 'I251:401;35:375',
    'service_5.png': '251:403',
    'product_1.png': '620:1325',
    'product_2.png': '620:1326',
    'product_3.png': '620:1327',
    'product_4.png': '620:1328',
    'product_5.png': '620:1336',
    'product_6.png': '620:1330',
    'product_7.png': '620:1331',
    'product_8.png': '620:1333',
    'map.png': '633:1197',
    'brand_stout.png': '620:1263',
    'brand_arrow.png': '620:1264',
    'brand_rommer.png': '620:1265',
}

def download_batch(assets, format='png'):
    ids = ','.join(assets.values())
    headers = {'X-Figma-Token': TOKEN}
    r = requests.get(f'https://api.figma.com/v1/images/{FILE_KEY}?ids={ids}&format={format}', headers=headers)
    
    if r.status_code == 200:
        data = r.json().get('images', {})
        for name, node_id in assets.items():
            img_url = data.get(node_id)
            if img_url:
                img_data = requests.get(img_url).content
                with open(f'assets/{name}', 'wb') as f:
                    f.write(img_data)
                print(f'Successfully downloaded {name}')
            else:
                print(f'Could not find image link for {name} ({node_id})')
    else:
        print(f'Failed to fetch images for batch: {r.status_code} {r.text}')

if __name__ == '__main__':
    if not os.path.exists('assets'):
        os.makedirs('assets')
    
    # Split into SVG and PNG batches
    svg_assets = {k: v for k, v in ASSET_MAP.items() if k.endswith('.svg')}
    png_assets = {k: v for k, v in ASSET_MAP.items() if k.endswith('.png')}
    
    if svg_assets:
        download_batch(svg_assets, format='svg')
        time.sleep(2)
    
    if png_assets:
        # Split PNGs into two sub-batches to be safe
        png_list = list(png_assets.items())
        half = len(png_list) // 2
        
        download_batch(dict(png_list[:half]), format='png')
        time.sleep(2)
        download_batch(dict(png_list[half:]), format='png')
