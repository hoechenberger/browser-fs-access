from pathlib import Path

chars = 'The quick brown fox jumps over the lazy dog. '
garbage = chars * int(1e9 / len(chars))
path = Path('/tmp/garbage.txt')

for i in range(1, 30 + 1):
    print(f'Iteration {i}')
    with path.open(mode='a', encoding='utf-8') as f:
        f.write(garbage)
