import requests
import time
import os

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'
HEADERS = {'X-Figma-Token': TOKEN}

# Precise node IDs for the image frames inside product containers
PRODUCT_IMAGE_NODES = {
    'product_1.png': '620:1325',
    'product_2.png': '620:1326',
    'product_3.png': '620:1327',
    'product_4.png': '620:1328',
    'product_5.png': '620:1336',
    'product_6.png': '620:1330',
    'product_7.png': '620:1331',
    'product_8.png': '620:1333'
}

def download_asset(node_id, name):
    # Request PNG at 2x scale for better quality
    r = requests.get(f'https://api.figma.com/v1/images/{FILE_KEY}?ids={node_id}&format=png&scale=2', headers=HEADERS)
    if r.status_code == 200:
        data = r.json()
        url = data.get('images', {}).get(node_id)
        if url:
            img_data = requests.get(url).content
            with open(f'assets/{name}', 'wb') as f:
                f.write(img_data)
            print(f'Successfully downloaded CLEAN {name}')
            return True
        else:
            print(f'URL not found for {node_id}')
    else:
        print(f'Failed to fetch image info for {node_id}: {r.status_code}')
    return False

if __name__ == '__main__':
    if not os.path.exists('assets'):
        os.makedirs('assets')
    
    print("Starting download of clean product photos from Figma API...")
    for name, node_id in PRODUCT_IMAGE_NODES.items():
        if download_asset(node_id, name):
            time.sleep(1) # Small delay to be polite
        else:
            print(f"Retrying {name} in 5 seconds...")
            time.sleep(5)
            download_asset(node_id, name)
