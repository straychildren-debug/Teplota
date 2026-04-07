import requests
import json
import os

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'
NODE_ID = '35:381' # Re-checking from previous listing or broader frame

def get_nodes(file_key, ids):
    headers = {'X-Figma-Token': TOKEN}
    r = requests.get(f'https://api.figma.com/v1/files/{file_key}/nodes?ids={ids}', headers=headers)
    return r.json()

def list_image_nodes(node, indent=0):
    node_id = node.get('id')
    name = node.get('name', '--')
    type = node.get('type', '--')
    
    # Check if it has a fill that looks like an image or is a RECTANGLE with image-like name
    if type == 'RECTANGLE' or 'image' in name.lower():
        print('  ' * indent + f'[IMAGE NODE] {node_id} | {name} | {type}')
    
    if 'children' in node:
        for child in node['children']:
            list_image_nodes(child, indent + 1)

if __name__ == '__main__':
    # Checking the main design frame again
    data = get_nodes(FILE_KEY, '251:343')
    root_node = data['nodes']['251:343']['document']
    list_image_nodes(root_node)
