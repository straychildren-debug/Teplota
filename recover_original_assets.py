import requests
import json
import os

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'
HEADERS = {'X-Figma-Token': TOKEN}

# Product IDs we identified earlier
PRODUCT_NODES = {
    'product_1.png': '620:1325',
    'product_2.png': '620:1326',
    'product_3.png': '620:1327',
    'product_4.png': '620:1328',
    'product_5.png': '620:1336',
    'product_6.png': '620:1330',
    'product_7.png': '620:1331',
    'product_8.png': '620:1333'
}

def get_image_refs():
    print("Fetching image nodes to find refs...")
    # Get nodes for products to find their imageRef in fills
    ids = ','.join(PRODUCT_NODES.values())
    r = requests.get(f'https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={ids}', headers=HEADERS)
    print(f"Status nodes: {r.status_code}")
    res = r.json()
    if 'nodes' not in res:
        print(f"Error in response: {res}")
        return {}
    nodes_data = res['nodes']
    
    ref_map = {}
    for filename, node_id in PRODUCT_NODES.items():
        if node_id in nodes_data:
            node = nodes_data[node_id]['document']
            fills = node.get('fills', []) + node.get('background', [])
            for fill in fills:
                if fill.get('type') == 'IMAGE':
                    ref_map[filename] = fill.get('imageRef')
                    break
    return ref_map

def download_from_refs(ref_map):
    print("Fetching direct S3 URLs for refs...")
    r = requests.get(f'https://api.figma.com/v1/files/{FILE_KEY}/images', headers=HEADERS)
    print(f"Status images: {r.status_code}")
    url_map = r.json().get('meta', {}).get('images', {})
    
    if not os.path.exists('assets'):
        os.makedirs('assets')
        
    for filename, ref in ref_map.items():
        s3_url = url_map.get(ref)
        if s3_url:
            print(f"Downloading {filename} from original source...")
            img_data = requests.get(s3_url).content
            with open(f'assets/{filename}', 'wb') as f:
                f.write(img_data)
        else:
            print(f"Could not find S3 URL for ref {ref} ({filename})")

if __name__ == '__main__':
    try:
        refs = get_image_refs()
        if refs:
            download_from_refs(refs)
            print("Successfully re-downloaded base assets.")
        else:
            print("Failed to get image refs.")
    except Exception as e:
        print(f"Error: {e}")
