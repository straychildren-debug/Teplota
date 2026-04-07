import requests
import time
import os

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'
HEADERS = {'X-Figma-Token': TOKEN}

ASSETS = {
    '620:1325': 'product_1.png',
    '620:1326': 'product_2.png',
    '620:1327': 'product_3.png',
    '620:1328': 'product_4.png',
    '620:1336': 'product_5.png',
    '620:1330': 'product_6.png',
    '620:1331': 'product_7.png',
    '620:1333': 'product_8.png',
    '633:1197': 'map.png',
    '620:1263': 'brand_stout.png',
    '620:1264': 'brand_arrow.png',
    '620:1265': 'brand_rommer.png'
}

def download_asset(node_id, name):
    r = requests.get(f'https://api.figma.com/v1/images/{FILE_KEY}?ids={node_id}&format=png', headers=HEADERS)
    if r.status_code == 200:
        data = r.json()
        url = data.get('images', {}).get(node_id)
        if url:
            img_data = requests.get(url).content
            with open(f'assets/{name}', 'wb') as f:
                f.write(img_data)
            print(f'Saved {name}')
            return True
        else:
            print(f'URL not found for {node_id}')
    else:
        print(f'Failed to fetch image info for {node_id}: {r.status_code}')
    return False

if __name__ == '__main__':
    if not os.path.exists('assets'):
        os.makedirs('assets')
    
    for node_id, name in ASSETS.items():
        if download_asset(node_id, name):
            time.sleep(2)  # Delay between assets
        else:
            time.sleep(5)  # Longer delay on failure
