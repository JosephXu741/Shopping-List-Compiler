import pandas as pd
import sys 

data_path = sys.argv[1]
path = './' + data_path

raw_data = pd.read_csv(path, delimiter='\n', header=None)
write_label = open("labels.txt", "a")
write_data = open("data.txt", "a")


for i in raw_data[0]:
    print(i)
    label = input("Enter Label: ")
    write_label.write(label + '\n')
    write_data.write(i + '\n')
    remaining = open(path, 'r').read().splitlines(True)
    write_remaining = open(path, 'w').writelines(remaining[1:])

    


