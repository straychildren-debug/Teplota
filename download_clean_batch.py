import requests
import os

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'
HEADERS = {'X-Figma-Token': TOKEN}

# Node IDs for the actual images
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

def download_clean_batch():
    ids_param = ','.join(PRODUCT_IMAGE_NODES.values())
    # Request PNG at 2.0 scale for high resolution
    r = requests.get(f'https://api.figma.com/v1/images/{FILE_KEY}?ids={ids_param}&format=png&scale=2', headers=HEADERS)
    
    if r.status_code == 200:
        data = r.json()
        images = data.get('images', {})
        for name, node_id in PRODUCT_IMAGE_NODES.items():
            url = images.get(node_id)
            if url:
                img_data = requests.get(url).content
                with open(f'assets/{name}', 'wb') as f:
                    f.write(img_data)
                print(f'Successfully downloaded CLEAN BATCH {name}')
            else:
                print(f'URL not found for {name} ({node_id})')
    elif r.status_code == 429:
        print("Rate limited globally. Waiting 30s before one last try...")
    else:
        print(f'Failed to fetch batch: {r.status_code} {r.text}')

if __name__ == '__main__':
    if not os.path.exists('assets'):
        os.makedirs('assets')
    download_clean_batch()
