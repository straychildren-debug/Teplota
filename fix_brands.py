import requests
import json
import os
import time

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'
HEADERS = {'X-Figma-Token': TOKEN}

BRAND_NODES = {
    'brand_stout.png': '620:1263',
    'brand_arrow.png': '620:1264',
    'brand_rommer.png': '620:1265'
}

def fix_brands():
    print("Fetching brand image refs (attempting bypass)...")
    
    # Use the images (render) endpoint for just these 3 small items
    ids = ','.join(BRAND_NODES.values())
    r = requests.get(f'https://api.figma.com/v1/images/{FILE_KEY}?ids={ids}&format=png&scale=2', headers=HEADERS)
    
    if r.status_code == 200:
        data = r.json()
        images = data.get('images', {})
        for filename, node_id in BRAND_NODES.items():
            url = images.get(node_id)
            if url:
                print(f"Downloading original source for {filename}...")
                img_data = requests.get(url).content
                with open(f'assets/{filename}', 'wb') as f:
                    f.write(img_data)
        return True
    else:
        print(f"Bypass failed: {r.status_code} {r.text}")
        return False

if __name__ == '__main__':
    if not fix_brands():
        # Last resort: try to get the imageRef from node data if we can
        # but node data request is also 429 prone.
        pass
