import requests
import json
import os

TOKEN = 'figd_hL05Fzng7vjvuXTQ1rBs2kGRgoT3C7alK6VBR-cx'
FILE_KEY = 'qLKarFsVZNLafkgARZ8DCv'
NODE_ID = '251:343'

def get_nodes(file_key, ids):
    headers = {'X-Figma-Token': TOKEN}
    r = requests.get(f'https://api.figma.com/v1/files/{file_key}/nodes?ids={ids}', headers=headers)
    return r.json()

def list_children(node, indent=0):
    node_id = node.get('id')
    name = node.get('name', '--')
    type = node.get('type', '--')
    print('  ' * indent + f'{node_id} | {name} | {type}')
    
    if 'children' in node:
        for child in node['children']:
            list_children(child, indent + 1)

if __name__ == '__main__':
    data = get_nodes(FILE_KEY, NODE_ID)
    root_node = data['nodes'][NODE_ID]['document']
    list_children(root_node)
