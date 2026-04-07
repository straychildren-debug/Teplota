import os

assets_dir = 'assets'
for i in range(1, 9):
    old_name = f'clean_product_{i}.png'
    new_name = f'product_{i}.png'
    old_path = os.path.join(assets_dir, old_name)
    new_path = os.path.join(assets_dir, new_name)
    
    if os.path.exists(old_path):
        if os.path.exists(new_path):
            os.remove(new_path)
        os.rename(old_path, new_path)
        print(f'Successfully replaced {new_name} with clean version.')
